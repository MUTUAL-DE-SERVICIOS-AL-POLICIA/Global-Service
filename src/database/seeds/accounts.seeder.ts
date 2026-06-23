import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { firstValueFrom, timeout } from 'rxjs';
import { Account } from '../../account/entities/account.entity';
import { FinancialEntity } from '../../financial-entities/entities/financial-entity.entity';
import { NastEnvs } from '../../config';

type SeedAccount = {
  id: number;
  financialEntityId: number;
  name: string;
  state: string;
  accountNumber: string;
  cta: string;
  ciNitTitular: string;
};

type BcbAccount = {
  eif?: string;
  eifCuenta?: string;
  cta?: string;
  ciNitTitular?: string;
  nombreTitular?: string;
  estado?: string;
};

const ACCOUNTS: SeedAccount[] = [
  {
    id: 1,
    financialEntityId: 14,
    name: 'SERVICIOS VARIOS',
    state: 'activo',
    accountNumber: '1-33175642',
    cta: '0',
    ciNitTitular: '234578021',
  },
  {
    id: 2,
    financialEntityId: 14,
    name: 'AUXILIO MORTUORIO',
    state: 'activo',
    accountNumber: '1-33175741',
    cta: '0',
    ciNitTitular: '234578021',
  },
  {
    id: 3,
    financialEntityId: 14,
    name: 'PRÉSTAMOS Y DIVIDENDOS',
    state: 'activo',
    accountNumber: '1-33175676',
    cta: '0',
    ciNitTitular: '234578021',
  },
  {
    id: 4,
    financialEntityId: 14,
    name: 'FONDO DE RETIRO Y CUOTA MORTUORIA',
    state: 'activo',
    accountNumber: '1-33175733',
    cta: '0',
    ciNitTitular: '234578021',
  },
];

export default class AccountsSeeder implements Seeder {
  track = true;

  async run(dataSource: DataSource): Promise<void> {
    const accountRepository = dataSource.getRepository(Account);

    for (const account of ACCOUNTS) {
      await this.upsertLocalAccount(accountRepository, account);
    }

    const financialEntityEifs = await this.getFinancialEntityEifs(dataSource);
    const client = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: {
        servers: NastEnvs.natsServers,
      },
    });

    await client.connect();

    try {
      let bcbAccounts = await this.getBcbAccounts(client);

      for (const account of ACCOUNTS) {
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

        await this.upsertLocalAccount(accountRepository, {
          ...account,
          cta: bcbAccount.cta,
        });
      }
    } finally {
      await client.close();
    }

    await this.syncAccountSequence(dataSource);
  }

  private async getFinancialEntityEifs(
    dataSource: DataSource,
  ): Promise<Map<number, string>> {
    const financialEntityIds = [
      ...new Set(ACCOUNTS.map((account) => account.financialEntityId)),
    ];
    const financialEntityRepository = dataSource.getRepository(FinancialEntity);
    const financialEntities = await financialEntityRepository.find({
      select: ['id', 'eif'],
      where: financialEntityIds.map((id) => ({ id })),
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
    account: SeedAccount,
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
    account: SeedAccount,
  ): BcbAccount | undefined {
    return accounts.find(
      (bcbAccount) =>
        bcbAccount.eif === financialEntityEif &&
        bcbAccount.eifCuenta === this.toBcbAccountNumber(account.accountNumber),
    );
  }

  private async upsertLocalAccount(
    accountRepository: Repository<Account>,
    account: SeedAccount,
  ): Promise<void> {
    const where: FindOptionsWhere<Account>[] = [
      { id: account.id },
      { accountNumber: account.accountNumber },
    ];

    const existingAccount = await accountRepository.findOne({ where });

    await accountRepository.save({
      ...(existingAccount ?? {}),
      id: existingAccount?.id ?? account.id,
      financialEntityId: account.financialEntityId,
      name: account.name,
      state: account.state,
      accountNumber: account.accountNumber,
      cta: account.cta,
      ciNitTitular: account.ciNitTitular,
    });
  }

  private toBcbAccountNumber(accountNumber: string): string {
    return accountNumber.replace(/\D/g, '');
  }

  private async syncAccountSequence(dataSource: DataSource): Promise<void> {
    const schema = (dataSource.options as { schema?: string }).schema ?? 'global';

    await dataSource.query(`
      SELECT setval(
        pg_get_serial_sequence('${schema}.accounts', 'id'),
        COALESCE((SELECT MAX(id) FROM ${schema}.accounts), 1)
      )
    `);
  }
}
