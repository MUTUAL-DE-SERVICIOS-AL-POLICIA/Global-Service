import { Module } from '@nestjs/common';
import { BreakdownsService } from './breakdowns.service';
import { BreakdownsController } from './breakdowns.controller';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breakdown, Unit } from './entities';

@Module({
  controllers: [BreakdownsController, UnitsController],
  providers: [BreakdownsService, UnitsService],
  imports: [TypeOrmModule.forFeature([Breakdown, Unit])],
})
export class BreakdownsModule {}
