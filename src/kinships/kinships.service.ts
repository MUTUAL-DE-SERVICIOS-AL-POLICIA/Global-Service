import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kinship } from './entities/kinship.entity';
import { In, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class KinshipsService {
  constructor(
    @InjectRepository(Kinship)
    private readonly kinshipsRepository: Repository<Kinship>,
  ) {}

  async findAll(): Promise<Partial<Kinship>[]> {
    return this.kinshipsRepository.find({
      select: ['id', 'name'],
    });
  }

  async findOne(id: number): Promise<Kinship> {
    const kinship = await this.kinshipsRepository.findOneBy({ id });

    if (!kinship)
      throw new RpcException({
        message: `Kinship with ${id} not found`,
        code: 404,
      });

    return kinship;
  }

  async findAllByIds(
    ids: number[],
  ): Promise<Record<number, { id: number; name: string }>> {
    const kinships = await this.kinshipsRepository.findBy({ id: In(ids) });

    return kinships.reduce(
      (acc, k) => {
        acc[k.id] = { id: k.id, name: k.name };
        return acc;
      },
      {} as Record<number, { id: number; name: string }>,
    );
  }
}
