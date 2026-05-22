import { execFileSync } from 'node:child_process';
import { Client } from 'pg';
import { DbEnvs } from 'src/config';

function validateSchemaName(schema: string) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(schema)) {
    throw new Error(`Invalid schema name: ${schema}`);
  }
}

async function ensureMigrationsSchema() {
  validateSchemaName(DbEnvs.dbSchema);

  const client = new Client({
    host: DbEnvs.dbHost,
    port: DbEnvs.dbPort,
    user: DbEnvs.dbUsername,
    password: DbEnvs.dbPassword,
    database: DbEnvs.dbDatabase,
  });

  await client.connect();

  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${DbEnvs.dbSchema}"`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS "${DbEnvs.dbSchema}"."migrations" (
        "id" SERIAL NOT NULL,
        "timestamp" bigint NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
      )
    `);
  } finally {
    await client.end();
  }
}

async function run() {
  const command = process.argv[2];

  if (!['show', 'run'].includes(command)) {
    throw new Error(`Unsupported migration command: ${command}`);
  }

  await ensureMigrationsSchema();

  execFileSync(
    process.execPath,
    [
      '-r',
      'ts-node/register',
      '-r',
      'tsconfig-paths/register',
      './node_modules/typeorm/cli.js',
      `migration:${command}`,
      '-d',
      'src/database/data-source.ts',
    ],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_PATH:
          process.env.NODE_PATH ?? './node_modules/.pnpm/node_modules',
      },
    },
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
