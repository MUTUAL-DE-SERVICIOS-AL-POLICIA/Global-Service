import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UnitsService } from './units.service';

@Controller()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @MessagePattern('units.findAll')
  findAll() {
    return this.unitsService.findAll();
  }

  @MessagePattern('units.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.unitsService.findOne(id);
  }
}
