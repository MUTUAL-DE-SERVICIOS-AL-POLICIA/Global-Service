import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProcedureDocumentsModule } from './procedure-documents/procedure-documents.module';
import { UnitsModule } from './units/units.module';
import { DegreesModule } from './degrees/degrees.module';
import { DbEnvs } from './config';
import { CategoriesModule } from './categories/categories.module';
import { KinshipsModule } from './kinships/kinships.module';

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
    }),
    ProcedureDocumentsModule,
    UnitsModule,
    DegreesModule,
    CategoriesModule,
    KinshipsModule,
  ],
})
export class AppModule {}
