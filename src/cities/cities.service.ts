import { Injectable } from '@nestjs/common';

@Injectable()
export class CitiesService {

  findAll() {
    return `This action returns all cities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

}
