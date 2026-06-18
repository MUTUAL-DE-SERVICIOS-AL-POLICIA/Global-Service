import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialEntity } from './entities/financial-entity.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FinancialEntitiesService {
  private readonly logger = new Logger('FinancialEntitiesService');

  constructor(
    @InjectRepository(FinancialEntity)
    private readonly financialEntitiesRepository: Repository<FinancialEntity>,
  ) {}

  async financialEntities(): Promise<{
    error: boolean;
    message: string;
    data: Pick<FinancialEntity, 'id' | 'name' | 'code'>[] | null;
  }> {
    try {
      const financialEntities = await this.financialEntitiesRepository.find({
        select: ['id', 'name', 'code'],
        where: { isActive: true },
      });

      return {
        error: false,
        message: 'Entidades financieras obtenidas correctamente',
        data: financialEntities,
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener las entidades financieras: ${error.message}`,
        error.stack,
      );
      return {
        error: true,
        message: 'Error al obtener las entidades financieras',
        data: null,
      };
    }
  }
}
