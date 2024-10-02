import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DegreesService } from './degrees.service';

@Controller()
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  @MessagePattern('findAllDegrees')
  findAll() {
    return this.degreesService.findAll();
  }

  @MessagePattern('findOneDegree')
  findOne(@Payload() id: number) {
    return this.degreesService.findOne(id);
  }
}
