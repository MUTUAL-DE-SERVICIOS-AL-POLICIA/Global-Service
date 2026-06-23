import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { firstValueFrom, timeout } from 'rxjs';
import { Account } from '../../account/entities/account.entity';
import { FinancialEntity } from '../../financial-entities/entities/financial-entity.entity';
import { NastEnvs } from '../../config';

type BcbSyncAccount = Pick<
  Account,
  'id' | 'financialEntityId' | 'name' | 'state' | 'accountNumber' | 'ciNitTitular'
>;

type BcbAccount = {
  eif?: string;
  eifCuenta?: string;
  cta?: string;
  ciNitTitular?: string;
  nombreTitular?: string;
  estado?: string;
};

export default class AccountsSeeder implements Seeder {
  track = true;

  async run(dataSource: DataSource): Promise<void> {
    const accountRepository = dataSource.getRepository(Account);
    const accounts = await accountRepository.find({
      select: [
        'id',
        'financialEntityId',
        'name',
        'state',
        'accountNumber',
        'ciNitTitular',
      ],
    });

    if (accounts.length === 0) {
      return;
    }

    const financialEntityEifs = await this.getFinancialEntityEifs(
      dataSource,
      accounts,
    );
    const client = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: {
        servers: NastEnvs.natsServers,
      },
    });

    await client.connect();

    try {
      let bcbAccounts = await this.getBcbAccounts(client);

      for (const account of accounts) {
        const financialEntityEif = financialEntityEifs.get(account.financialEntityId);

        if (!financialEntityEif) {
          throw new Error(
            `La entidad financiera ${account.financialEntityId} no tiene EIF configurado`,
          );
        }

        let bcbAccount = this.findBcbAccount(
          bcbAccounts,
          financialEntityEif,
          account,
        );

        if (!bcbAccount) {
          await this.createBcbAccount(client, financialEntityEif, account);
          bcbAccounts = await this.getBcbAccounts(client);
          bcbAccount = this.findBcbAccount(
            bcbAccounts,
            financialEntityEif,
            account,
          );
        }

        if (!bcbAccount?.cta) {
          throw new Error(`BCB no devolvio cta para la cuenta ${account.name}`);
        }

        await accountRepository.update({ id: account.id }, { cta: bcbAccount.cta });
      }
    } finally {
      await client.close();
    }
  }

  private async getFinancialEntityEifs(
    dataSource: DataSource,
    accounts: BcbSyncAccount[],
  ): Promise<Map<number, string>> {
    const financialEntityIds = [
      ...new Set(accounts.map((account) => account.financialEntityId)),
    ];
    const financialEntityRepository = dataSource.getRepository(FinancialEntity);
    const financialEntities = await financialEntityRepository.find({
      select: ['id', 'eif'],
      where: { id: In(financialEntityIds) },
    });

    return new Map(
      financialEntities
        .filter(
          (financialEntity): financialEntity is FinancialEntity & { eif: string } =>
            !!financialEntity.eif,
        )
        .map((financialEntity) => [financialEntity.id, financialEntity.eif]),
    );
  }

  private async getBcbAccounts(client: ClientProxy): Promise<BcbAccount[]> {
    const response = await this.sendBcbMessage(client, 'bcb.entities', {});

    if (!response?.serviceStatus || response?.error) {
      throw new Error(response?.message ?? 'No se pudo consultar cuentas BCB');
    }

    const accounts = response?.datos?.cuentas;

    if (!Array.isArray(accounts)) {
      throw new Error('BCB no devolvio la lista de cuentas de la entidad');
    }

    return accounts;
  }

  private async createBcbAccount(
    client: ClientProxy,
    financialEntityEif: string,
    account: BcbSyncAccount,
  ): Promise<void> {
    const response = await this.sendBcbMessage(client, 'bcb.createAccount', {
      eif: financialEntityEif,
      eifCuenta: this.toBcbAccountNumber(account.accountNumber),
      ciNitTitular: account.ciNitTitular,
      nombreTitular: account.name,
      estado: account.state.toUpperCase(),
    });

    if (!response?.serviceStatus || response?.error || response?.finalizado === false) {
      throw new Error(
        response?.message ?? response?.mensaje ?? `No se pudo crear cuenta BCB ${account.name}`,
      );
    }
  }

  private async sendBcbMessage(client: ClientProxy, pattern: string, payload: unknown) {
    return firstValueFrom(client.send(pattern, payload).pipe(timeout(30000)));
  }

  private findBcbAccount(
    accounts: BcbAccount[],
    financialEntityEif: string,
    account: BcbSyncAccount,
  ): BcbAccount | undefined {
    return accounts.find(
      (bcbAccount) =>
        bcbAccount.eif === financialEntityEif &&
        bcbAccount.eifCuenta === this.toBcbAccountNumber(account.accountNumber),
    );
  }

  private toBcbAccountNumber(accountNumber: string): string {
    return accountNumber.replace(/\D/g, '');
  }
}
