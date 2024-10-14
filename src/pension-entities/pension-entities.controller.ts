import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PensionEntitiesService } from './pension-entities.service';

@Controller()
export class PensionEntitiesController {
  constructor(
    private readonly pensionEntitiesService: PensionEntitiesService,
  ) {}

  @MessagePattern('pensionEntities.findAll')
  findAllPensionEntities() {
    return this.pensionEntitiesService.findAllPensionEntities();
  }

  @MessagePattern('pensionEntity.findOne')
  findOnePensionEntity(@Payload('id', ParseIntPipe) id: number) {
    return this.pensionEntitiesService.findOnePensionEntity(id);
  }
}
