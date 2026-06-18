import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FinancialEntitiesService } from './financial-entities.service';

@Controller()
export class FinancialEntitiesController {
  constructor(
    private readonly financialEntitiesService: FinancialEntitiesService,
  ) {}

  @MessagePattern('global.financialEntities')
  async financialEntities() {
    return this.financialEntitiesService.financialEntities();
  }

}
