import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PensionEntity } from './entities/pension-entity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PensionEntitiesService {
  constructor(
    @InjectRepository(PensionEntity)
    private readonly pensionEntitiesRepository: Repository<PensionEntity>,
  ) {}

  async findAllPensionEntities(): Promise<Partial<PensionEntity>[]> {
    return this.pensionEntitiesRepository.find({
      select: ['id', 'type', 'name'],
    });
  }

  async findOnePensionEntity(id: number): Promise<PensionEntity> {
    const pensionEntity = this.pensionEntitiesRepository.findOneBy({ id });
    if (!pensionEntity)
      throw new NotFoundException(`PensionEntity with ${id} not found`);
    return pensionEntity;
  }
}
