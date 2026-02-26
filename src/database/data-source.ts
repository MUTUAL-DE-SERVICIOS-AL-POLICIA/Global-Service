import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DbEnvs } from 'src/config';

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

  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  seedTracking: true,

  schema: DbEnvs.dbSchema,
  migrations: ['dist/database/migrations/**/*{.ts,.js}'],
};

export default new DataSource(options);
