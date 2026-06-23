import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { firstValueFrom, timeout } from 'rxjs';
import { Account } from '../../account/entities/account.entity';
import { NastEnvs } from '../../config';

type SeedAccount = {
  id: number;
  financialEntityId: string;
  name: string;
  state: string;
  accountNumber: string;
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
    financialEntityId: 'MLD1014',
    name: 'SERVICIOS VARIOS',
    state: 'activo',
    accountNumber: '1-33175642',
    ciNitTitular: '234578021',
  },
  {
    id: 2,
    financialEntityId: 'MLD1014',
    name: 'AUXILIO MORTUORIO',
    state: 'activo',
    accountNumber: '1-33175741',
    ciNitTitular: '234578021',
  },
  {
    id: 3,
    financialEntityId: 'MLD1014',
    name: 'PRÉSTAMOS Y DIVIDENDOS',
    state: 'activo',
    accountNumber: '1-33175676',
    ciNitTitular: '234578021',
  },
  {
    id: 4,
    financialEntityId: 'MLD1014',
    name: 'FONDO DE RETIRO Y CUOTA MORTUORIA',
    state: 'activo',
    accountNumber: '1-33175733',
    ciNitTitular: '234578021',
  },
];

export default class AccountsSeeder implements Seeder {
  track = true;

  async run(dataSource: DataSource): Promise<void> {
    const accountRepository = dataSource.getRepository(Account);
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
        let bcbAccount = this.findBcbAccount(bcbAccounts, account);

        if (!bcbAccount) {
          await this.createBcbAccount(client, account);
          bcbAccounts = await this.getBcbAccounts(client);
          bcbAccount = this.findBcbAccount(bcbAccounts, account);
        }

        await this.upsertLocalAccount(accountRepository, account, bcbAccount);
      }

      await this.syncAccountSequence(dataSource);
    } finally {
      await client.close();
    }
  }

  private async getBcbAccounts(client: ClientProxy): Promise<BcbAccount[]> {
    const response = await this.sendBcbMessage(client, 'bcb.entities', {});

    if (!response?.serviceStatus || response?.error) {
      throw new Error(response?.message ?? 'No se pudo consultar cuentas BCB');
    }

    const accounts = response?.datos?.cuentas;

    if (!Array.isArray(accounts)) {
      throw new Error('BCB no devolvió la lista de cuentas de la entidad');
    }

    return accounts;
  }

  private async createBcbAccount(client: ClientProxy, account: SeedAccount): Promise<void> {
    const response = await this.sendBcbMessage(client, 'bcb.createAccount', {
      eif: account.financialEntityId,
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

  private findBcbAccount(accounts: BcbAccount[], account: SeedAccount): BcbAccount | undefined {
    return accounts.find(
      (bcbAccount) =>
        bcbAccount.eif === account.financialEntityId &&
        bcbAccount.eifCuenta === this.toBcbAccountNumber(account.accountNumber),
    );
  }

  private async upsertLocalAccount(
    accountRepository: Repository<Account>,
    account: SeedAccount,
    bcbAccount?: BcbAccount,
  ): Promise<void> {
    const where: FindOptionsWhere<Account>[] = [
      { id: account.id },
      { accountNumber: account.accountNumber },
    ];

    if (bcbAccount?.cta) {
      where.push({ cta: bcbAccount.cta });
    }

    const existingAccount = await accountRepository.findOne({ where });

    await accountRepository.save({
      ...(existingAccount ?? {}),
      id: existingAccount?.id ?? account.id,
      financialEntityId: account.financialEntityId,
      name: account.name,
      state: bcbAccount?.estado?.toLowerCase() ?? account.state,
      accountNumber: account.accountNumber,
      ciNitTitular: bcbAccount?.ciNitTitular ?? account.ciNitTitular,
      cta: bcbAccount?.cta ?? existingAccount?.cta ?? '0',
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
