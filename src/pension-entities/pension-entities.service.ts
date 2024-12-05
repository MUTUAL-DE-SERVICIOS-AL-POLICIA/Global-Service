import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PensionEntity } from './entities/pension-entity.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PensionEntitiesService {
  constructor(
    @InjectRepository(PensionEntity)
    private readonly pensionEntitiesRepository: Repository<PensionEntity>,
  ) {}

  async findAll(): Promise<Partial<PensionEntity>[]> {
    return this.pensionEntitiesRepository.find({
      select: ['id', 'type', 'name'],
    });
  }

  async findOne(id: number): Promise<PensionEntity> {
    const pensionEntity = this.pensionEntitiesRepository.findOneBy({ id });
    if (!pensionEntity)
      throw new RpcException({
        message: `PensionEntity with ${id} not found`,
        code: 404,
      });
    return pensionEntity;
  }
}
