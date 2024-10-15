import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CitiesService } from './cities.service';

@Controller()
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @MessagePattern('cities.findAll')
  findAll() {
    return this.citiesService.findAll();
  }

  @MessagePattern('cities.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.citiesService.findOne(id);
  }
}
