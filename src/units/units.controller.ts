import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UnitsService } from './units.service';

@Controller()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @MessagePattern('units.findAll')
  findAllUnits() {
    return this.unitsService.findAllUnits();
  }

  @MessagePattern('units.findOne')
  findOneUnit(@Payload('id', ParseIntPipe) id: number) {
    return this.unitsService.findOneUnit(id);
  }

  @MessagePattern('breakdowns.findAll')
  findAllBreakdowns() {
    return this.unitsService.findAllBreakdowns();
  }

  @MessagePattern('breakdowns.findOne')
  findOneBreakdown(@Payload('id', ParseIntPipe) id: number) {
    return this.unitsService.findOneBreakdown(id);
  }
}
