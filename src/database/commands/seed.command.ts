import { runSeeders } from 'typeorm-extension';
import dataSource, { databaseSchema, quoteIdentifier } from '../data-source';
import {
  ACCOUNTS_SEED_NAME,
  revertAccountsSeed,
} from '../seeds/001-accounts.seed';

type Command = 'run' | 'show' | 'revert';

async function isSeedExecuted(): Promise<boolean> {
  const seedsTable = `${databaseSchema}.seeds`;
  const queryRunner = dataSource.createQueryRunner();

  try {
    if (!(await queryRunner.hasTable(seedsTable))) {
      return false;
    }

    const tablePath = `${quoteIdentifier(databaseSchema)}.${quoteIdentifier('seeds')}`;
    const rows: unknown[] = await queryRunner.query(
      `SELECT 1 FROM ${tablePath} WHERE name = $1 LIMIT 1`,
      [ACCOUNTS_SEED_NAME],
    );
    return rows.length > 0;
  } finally {
    await queryRunner.release();
  }
}

async function show(): Promise<void> {
  const executed = await isSeedExecuted();
  console.log(`[${executed ? 'X' : ' '}] ${ACCOUNTS_SEED_NAME}`);
}

async function run(): Promise<void> {
  const executed = await runSeeders(dataSource);
  console.log(`Seeders ejecutados: ${executed.length}`);
}

async function revert(): Promise<void> {
  if (!(await isSeedExecuted())) {
    console.log(`[ ] ${ACCOUNTS_SEED_NAME} no está ejecutado.`);
    return;
  }

  const tablePath = `${quoteIdentifier(databaseSchema)}.${quoteIdentifier('seeds')}`;
  await dataSource.transaction(async (manager) => {
    await revertAccountsSeed(manager);
    await manager.query(`DELETE FROM ${tablePath} WHERE name = $1`, [
      ACCOUNTS_SEED_NAME,
    ]);
  });

  console.log(`Seeder revertido: ${ACCOUNTS_SEED_NAME}`);
}

async function main(command: Command): Promise<void> {
  await dataSource.initialize();
  try {
    if (command === 'run') {
      await run();
      return;
    }

    if (command === 'show') {
      await show();
      return;
    }

    await revert();
  } finally {
    await dataSource.destroy();
  }
}

const command = process.argv[2];
if (command !== 'run' && command !== 'show' && command !== 'revert') {
  throw new Error('Uso: seed.command.ts <run|show|revert>');
}

void main(command);
