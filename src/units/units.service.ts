import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breakdown, Unit } from './entities';

@Injectable()
export class UnitsService {
  private readonly logger = new Logger('BreakdownService');
  constructor(
    @InjectRepository(Unit)
    private readonly unitsRepository: Repository<Unit>,
    @InjectRepository(Breakdown)
    private readonly breakdownsRepository: Repository<Breakdown>,
  ) {}
  async findAllUnits(): Promise<Partial<Unit>[]> {
    return this.unitsRepository.find({
      select: ['code', 'name'],
    });
  }

  async findOneUnits(id: number): Promise<Unit> {
    const unit = await this.unitsRepository.findOne({
      where: { id },
      relations: ['breakdown'],
    });

    if (!unit) throw new NotFoundException(`Unit with: ${id} not found`);

    return unit;
  }

  async findAllBreakdowns(): Promise<Partial<Breakdown>[]> {
    return this.breakdownsRepository.find({
      select: ['code', 'name'],
    });
  }

  async findOneBreakdowns(id: number): Promise<Breakdown> {
    const breakdown = await this.breakdownsRepository.findOne({
      where: { id },
      relations: ['units'],
    });

    if (!breakdown)
      throw new NotFoundException(`Breakdown with: ${id} not found`);

    return breakdown;
  }
}
