import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Degree, Hierarchy } from './entities';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class DegreesService {
  private readonly logger = new Logger('BreakdownService');
  constructor(
    @InjectRepository(Degree)
    private readonly degreesRepository: Repository<Degree>,
    @InjectRepository(Hierarchy)
    private readonly hierarchiesRepository: Repository<Hierarchy>,
  ) {}
  async findAllDegrees(): Promise<Partial<Degree>[]> {
    return this.degreesRepository.find({
      select: ['code', 'name'],
    });
  }

  async findOneDegrees(id: number): Promise<Degree> {
    const degree = await this.degreesRepository.findOne({
      where: { id },
      relations: ['hierarchy'],
    });

    if (!degree)
      throw new RpcException({
        message: `Degree with: ${id} not found`,
        code: 404,
      });

    return degree;
  }

  async findAllHierarchies(): Promise<Partial<Hierarchy>[]> {
    return this.hierarchiesRepository.find({
      select: ['code', 'name'],
    });
  }

  async findOneHierarchies(id: number): Promise<Hierarchy> {
    const hierarchy = await this.hierarchiesRepository.findOne({
      where: { id },
      relations: ['degrees'],
    });

    if (!hierarchy)
      throw new RpcException({
        message: `Hierarchy with: ${id} not found`,
        code: 404,
      });

    return hierarchy;
  }
}
