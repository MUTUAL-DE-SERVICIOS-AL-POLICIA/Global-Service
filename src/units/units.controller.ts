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
  findOneUnits(@Payload('id', ParseIntPipe) id: number) {
    return this.unitsService.findOneUnits(id);
  }

  @MessagePattern('breakdowns.findAll')
  findAllBreakdowns() {
    return this.unitsService.findAllBreakdowns();
  }

  @MessagePattern('breakdowns.findOne')
  findOneBreakdowns(@Payload('id', ParseIntPipe) id: number) {
    return this.unitsService.findOneBreakdowns(id);
  }
}
