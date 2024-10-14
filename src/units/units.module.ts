import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breakdown, Unit } from './entities';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

@Module({
  controllers: [UnitsController],
  providers: [UnitsService],
  imports: [TypeOrmModule.forFeature([Breakdown, Unit])],
})
export class UnitsModule {}
