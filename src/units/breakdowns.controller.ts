import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BreakdownsService } from './breakdowns.service';

@Controller()
export class BreakdownsController {
  constructor(private readonly breakdownsService: BreakdownsService) {}

  @MessagePattern('breakdowns.findAll')
  findAll() {
    return this.breakdownsService.findAll();
  }

  @MessagePattern('breakdowns.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.breakdownsService.findOne(id);
  }
}
