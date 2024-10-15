import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PensionEntitiesService } from './pension-entities.service';

@Controller()
export class PensionEntitiesController {
  constructor(
    private readonly pensionEntitiesService: PensionEntitiesService,
  ) {}

  @MessagePattern('pensionEntities.findAll')
  findAll() {
    return this.pensionEntitiesService.findAll();
  }

  @MessagePattern('pensionEntities.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.pensionEntitiesService.findOne(id);
  }
}
