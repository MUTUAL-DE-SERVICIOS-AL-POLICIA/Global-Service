import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kinship } from './entities/kinship.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KinshipsService {
  constructor(
    @InjectRepository(Kinship)
    private readonly kinshipsRepository: Repository<Kinship>,
  ) {}

  findAllKinships() {
    return this.kinshipsRepository.find({
      select: ['id', 'name'],
    });
  }

  findOneKinship(id: number) {
    const kinship = this.kinshipsRepository.findOneBy({ id });

    if (!kinship) throw new NotFoundException(`Kinship with ${id} not found`);

    return kinship;
  }
}
