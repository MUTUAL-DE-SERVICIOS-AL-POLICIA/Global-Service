import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UnitsService } from './units.service';

@Controller()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @MessagePattern('findAllBreakdowns')
  findAll() {
    return this.unitsService.findAll();
  }

  @MessagePattern('findOneBreakdown')
  findOne(@Payload() id: number) {
    return this.unitsService.findOne(id);
  }
}
