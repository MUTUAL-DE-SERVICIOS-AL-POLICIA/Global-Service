import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FinancialEntitiesService } from './financial-entities.service';

@Controller()
export class FinancialEntitiesController {
  constructor(
    private readonly financialEntitiesService: FinancialEntitiesService,
  ) {}

  @MessagePattern('financialEntities.findAll')
  findAllFinancialEntities() {
    return this.financialEntitiesService.findAllFinancialEntities();
  }

  @MessagePattern('financialEntity.findOne')
  findOneFinancialEntity(@Payload('id', ParseIntPipe) id: number) {
    return this.financialEntitiesService.findOneFinancialEntity(id);
  }
}
