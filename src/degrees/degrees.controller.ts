import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DegreesService } from './degrees.service';

@Controller()
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  @MessagePattern('degrees.findAll')
  findAllUnits() {
    return this.degreesService.findAllDegrees();
  }

  @MessagePattern('degree.findOne')
  findOneUnit(@Payload('id', ParseIntPipe) id: number) {
    return this.degreesService.findOneDegree(id);
  }

  @MessagePattern('hierarchies.findAll')
  findAllHierarchies() {
    return this.degreesService.findAllHierarchies();
  }

  @MessagePattern('hierarchy.findOne')
  findOneHierarchy(@Payload('id', ParseIntPipe) id: number) {
    return this.degreesService.findOneHierarchy(id);
  }
}
