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

  @MessagePattern('degrees.findOne')
  findOneUnits(@Payload('id', ParseIntPipe) id: number) {
    return this.degreesService.findOneDegrees(id);
  }

  @MessagePattern('hierarchies.findAll')
  findAllHierarchies() {
    return this.degreesService.findAllHierarchies();
  }

  @MessagePattern('hierarchies.findOne')
  findOneHierarchies(@Payload('id', ParseIntPipe) id: number) {
    return this.degreesService.findOneHierarchies(id);
  }
}
