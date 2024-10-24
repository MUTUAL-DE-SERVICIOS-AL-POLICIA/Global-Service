import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProcedureDocumentsModule } from './procedure-documents/procedure-documents.module';
import { UnitsModule } from './units/units.module';
import { DegreesModule } from './degrees/degrees.module';
import { DbEnvs } from './config';
import { CategoriesModule } from './categories/categories.module';
import { KinshipsModule } from './kinships/kinships.module';
import { FinancialEntitiesModule } from './financial-entities/financial-entities.module';
import { PensionEntitiesModule } from './pension-entities/pension-entities.module';
import { CitiesModule } from './cities/cities.module';
import { ModulesModule } from './modules/modules.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DbEnvs.dbHost,
      port: DbEnvs.dbPort,
      database: DbEnvs.dbDatabase,
      username: DbEnvs.dbUsername,
      password: DbEnvs.dbPassword,
      autoLoadEntities: DbEnvs.dbAutoLoadEntities,
      synchronize: DbEnvs.dbSynchronize,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ProcedureDocumentsModule,
    UnitsModule,
    DegreesModule,
    CategoriesModule,
    KinshipsModule,
    FinancialEntitiesModule,
    PensionEntitiesModule,
    CitiesModule,
    ModulesModule,
  ],
})
export class AppModule {}
