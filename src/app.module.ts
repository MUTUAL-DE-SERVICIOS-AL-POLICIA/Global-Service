import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProcedureDocumentsModule } from './procedure-documents/procedure-documents.module';
import { UnitsModule } from './units/units.module';
import { DegreesModule } from './degrees/degrees.module';
import { CategoriesModule } from './categories/categories.module';
import { KinshipsModule } from './kinships/kinships.module';
import { FinancialEntitiesModule } from './financial-entities/financial-entities.module';
import { PensionEntitiesModule } from './pension-entities/pension-entities.module';
import { CitiesModule } from './cities/cities.module';
import { ModulesModule } from './modules/modules.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { FileDossiersModule } from './file-dossiers/file-dossiers.module';
import { RetirementFundAveragesModule } from './retirement-fund-averages/retirement-fund-averages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CommonModule,
    ProcedureDocumentsModule,
    UnitsModule,
    DegreesModule,
    CategoriesModule,
    KinshipsModule,
    FinancialEntitiesModule,
    PensionEntitiesModule,
    CitiesModule,
    ModulesModule,
    FileDossiersModule,
    RetirementFundAveragesModule,
  ],
})
export class AppModule {}
