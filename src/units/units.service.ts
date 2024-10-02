import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities';

@Injectable()
export class UnitsService {
  private readonly logger = new Logger('BreakdownService');
  constructor(
    @InjectRepository(Unit)
    private readonly unitsRepository: Repository<Unit>,
  ) {}
  async findAll(): Promise<Partial<Unit>[]> {
    return this.unitsRepository.find({
      select: ['code', 'name'],
    });
  }

  async findOne(id: number): Promise<Unit> {
    const unit = await this.unitsRepository.findOneBy({ id });

    if (!unit) throw new NotFoundException(`Unit with: ${id} not found`);

    return unit;
  }
}
