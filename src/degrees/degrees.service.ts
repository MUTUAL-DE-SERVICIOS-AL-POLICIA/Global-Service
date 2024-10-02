import { Injectable } from '@nestjs/common';

@Injectable()
export class DegreesService {
  findAll() {
    return `This action returns all degrees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} degree`;
  }
}
