import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CitiesService } from './cities.service';

@Controller()
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @MessagePattern('cities.findAll')
  findAllCities() {
    return this.citiesService.findAllCities();
  }

  @MessagePattern('city.findOne')
  findOneCity(@Payload('id', ParseIntPipe) id: number) {
    return this.citiesService.findOneCity(id);
  }
}
