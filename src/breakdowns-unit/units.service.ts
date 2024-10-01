import { Injectable } from '@nestjs/common';

@Injectable()
export class UnitsService {
  findAll() {
    return `This action returns all units`;
  }

  findOne(id: number) {
    return `This action returns a #${id} unit`;
  }
}
