import { Injectable } from '@nestjs/common';

@Injectable()
export class BreakdownsService {
  findAll() {
    return `This action returns all breakdowns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} breakdown`;
  }
}
