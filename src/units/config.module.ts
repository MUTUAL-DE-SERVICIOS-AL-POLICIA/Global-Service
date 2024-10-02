import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreakdownsController } from './breakdowns.controller';
import { BreakdownsService } from './breakdowns.service';
import { Breakdown, Unit } from './entities';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

@Module({
  controllers: [BreakdownsController, UnitsController],
  providers: [BreakdownsService, UnitsService],
  imports: [TypeOrmModule.forFeature([Breakdown, Unit])],
})
export class UnitsModule {}
