import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BreakdownsService } from './breakdowns.service';

@Controller()
export class BreakdownsController {
  constructor(private readonly breakdownsService: BreakdownsService) {}

  @MessagePattern('findAllBreakdowns')
  findAll() {
    return this.breakdownsService.findAll();
  }

  @MessagePattern('findOneBreakdown')
  findOne(@Payload() id: number) {
    return this.breakdownsService.findOne(id);
  }
}
