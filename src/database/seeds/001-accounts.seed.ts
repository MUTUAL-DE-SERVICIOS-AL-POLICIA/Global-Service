import { DataSource, EntityManager, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Account } from '../../account/entities/account.entity';
import { databaseSchema, quoteIdentifier } from '../data-source';
import { ACCOUNTS_SEED_DATA } from '../seed-data/accounts.seed-data';

export const ACCOUNTS_SEED_NAME = 'AccountsSeed1779696000000';

async function synchronizeSequence(manager: EntityManager): Promise<void> {
  const tablePath = `${quoteIdentifier(databaseSchema)}.${quoteIdentifier('accounts')}`;

  await manager.query(
    `SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE(MAX(id), 1), COUNT(*) > 0) FROM ${tablePath}`,
    [`${databaseSchema}.accounts`],
  );
}

export async function revertAccountsSeed(
  manager: EntityManager,
): Promise<void> {
  await manager.getRepository(Account).delete({
    id: In(ACCOUNTS_SEED_DATA.map(({ id }) => id)),
  });
  await synchronizeSequence(manager);
}

export class AccountsSeed1779696000000 implements Seeder {
  track = true;

  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.manager.getRepository(Account).upsert(ACCOUNTS_SEED_DATA, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
    });
    await synchronizeSequence(dataSource.manager);
  }
}

export default AccountsSeed1779696000000;
