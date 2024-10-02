import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breakdown } from './entities';

@Injectable()
export class BreakdownsService {
  private readonly logger = new Logger('BreakdownService');
  constructor(
    @InjectRepository(Breakdown)
    private readonly breakdownsRepository: Repository<Breakdown>,
  ) {}
  async findAll(): Promise<Partial<Breakdown>[]> {
    return this.breakdownsRepository.find({
      select: ['code', 'name'],
    });
  }

  async findOne(id: number): Promise<Breakdown> {
    const breakdown = await this.breakdownsRepository.findOne({
      where: { id },
      relations: ['units'],
    });

    if (!breakdown)
      throw new NotFoundException(`breakdowns with: ${id} not found`);

    return breakdown;
  }
}
