import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CitiesService } from './cities.service';

@Controller()
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @MessagePattern('findAllCities')
  findAll() {
    return this.citiesService.findAll();
  }

  @MessagePattern('findOneCity')
  findOne(@Payload() id: number) {
    return this.citiesService.findOne(id);
  }

}
