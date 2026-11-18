import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DbEnvs } from 'src/config';

export const databaseSchema = DbEnvs.dbSchema;

export function quoteIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

export const options: DataSourceOptions & SeederOptions = {
  type: 'postgres' as const,
  host: DbEnvs.dbHost,
  port: DbEnvs.dbPort,
  database: DbEnvs.dbDatabase,
  username: DbEnvs.dbUsername,
  password: DbEnvs.dbPassword,
  synchronize: DbEnvs.dbSynchronize,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),

  seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
  seedTracking: true,

  schema: databaseSchema,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export async function ensureDatabaseSchema(
  dataSourceOptions: DataSourceOptions = options,
): Promise<void> {
  const bootstrap = new DataSource({
    ...dataSourceOptions,
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    entities: [],
    migrations: [],
    subscribers: [],
  });

  await bootstrap.initialize();
  try {
    await bootstrap.query(
      `CREATE SCHEMA IF NOT EXISTS ${quoteIdentifier(databaseSchema)}`,
    );
  } finally {
    await bootstrap.destroy();
  }
}

export class SchemaAwareDataSource extends DataSource {
  override async initialize(): Promise<this> {
    await ensureDatabaseSchema(this.options);
    return super.initialize();
  }
}

export default new SchemaAwareDataSource(options);
