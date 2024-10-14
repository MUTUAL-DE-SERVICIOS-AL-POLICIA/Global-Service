import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialEntity } from './entities/financial-entity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FinancialEntitiesService {
  constructor(
    @InjectRepository(FinancialEntity)
    private readonly financialEntitiesRepository: Repository<FinancialEntity>,
  ) {}

  async findAllFinancialEntities(): Promise<Partial<FinancialEntity>[]> {
    return this.financialEntitiesRepository.find({
      select: ['id', 'name'],
    });
  }

  async findOneFinancialEntity(id: number): Promise<FinancialEntity> {
    const financialEntity = this.financialEntitiesRepository.findOneBy({ id });
    if (!financialEntity)
      throw new NotFoundException(`Financial Entity with ${id} not found`);
    return financialEntity;
  }
}
