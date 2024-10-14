import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KinshipsService } from './kinships.service';

@Controller()
export class KinshipsController {
  constructor(private readonly kinshipsService: KinshipsService) {}

  @MessagePattern('kinships.findAll')
  findAllKinships() {
    return this.kinshipsService.findAllKinships();
  }

  @MessagePattern('kinship.findOne')
  findOneKinship(@Payload('id', ParseIntPipe) id: number) {
    return this.kinshipsService.findOneKinship(id);
  }
}
