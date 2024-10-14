import { Module } from '@nestjs/common';
import { FinancialEntitiesService } from './financial-entities.service';
import { FinancialEntitiesController } from './financial-entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialEntity } from './entities/financial-entity.entity';

@Module({
  controllers: [FinancialEntitiesController],
  providers: [FinancialEntitiesService],
  imports: [TypeOrmModule.forFeature([FinancialEntity])],
})
export class FinancialEntitiesModule {}
