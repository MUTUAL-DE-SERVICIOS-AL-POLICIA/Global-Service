import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FinancialEntitiesService } from './financial-entities.service';

@Controller()
export class FinancialEntitiesController {
  constructor(
    private readonly financialEntitiesService: FinancialEntitiesService,
  ) {}

  @MessagePattern('financialEntities.findAll')
  findAll() {
    return this.financialEntitiesService.findAll();
  }

  @MessagePattern('financialEntities.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.financialEntitiesService.findOne(id);
  }
}
