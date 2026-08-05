import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialEntity } from './entities/financial-entity.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

/**
 * Servicio encargado de la lógica de negocio relacionada con las Entidades Financieras.
 * Proporciona métodos para consultar información de entidades financieras desde la base de datos.
 */
@Injectable()
export class FinancialEntitiesService {
  /**
   * Constructor del servicio FinancialEntitiesService.
   * Inyecta el repositorio de TypeORM para la entidad FinancialEntity.
   * @param financialEntitiesRepository Repositorio de TypeORM para la entidad FinancialEntity.
   */
  constructor(
    @InjectRepository(FinancialEntity)
    private readonly financialEntitiesRepository: Repository<FinancialEntity>,
  ) {}

  async findAll(): Promise<Partial<FinancialEntity>[]> {
    return this.financialEntitiesRepository.find({
      select: ['id', 'name'],
    });
  }

  async findOne(id: number): Promise<FinancialEntity> {
    const financialEntity = await this.financialEntitiesRepository.findOneBy({
      id,
    });
    if (!financialEntity)
      throw new RpcException({
        message: `Financial Entity with ${id} not found`,
        code: 404,
      });
    return financialEntity;
  }

  async searchByEif(eif: string): Promise<{
    error: boolean;
    message: string;
    data: Pick<FinancialEntity, 'name' | 'code'> | null;
  }> {
    const normalizedEif = eif?.trim().toUpperCase();

    if (!normalizedEif) {
      return {
        error: true,
        message: 'El EIF es requerido',
        data: null,
      };
    }

    try {
      const financialEntity = await this.financialEntitiesRepository.findOne({
        select: ['name', 'code'],
        where: { eif: normalizedEif },
      });

      if (!financialEntity) {
        return {
          error: true,
          message: `No se encontró una entidad financiera con el EIF ${normalizedEif}`,
          data: null,
        };
      }

      return {
        error: false,
        message: 'Entidad financiera obtenida correctamente',
        data: financialEntity,
      };
    } catch {
      return {
        error: true,
        message: 'Error al buscar la entidad financiera por EIF',
        data: null,
      };
    }
  }

  async financialEntities(): Promise<{
    error: boolean;
    message: string;
    data:
      | Pick<FinancialEntity, 'id' | 'name' | 'code' | 'isActive' | 'eif'>[]
      | null;
  }> {
    try {
      const financialEntities = await this.financialEntitiesRepository.find({
        select: ['id', 'name', 'code', 'isActive', 'eif'],
        where: { isActive: true },
      });

      return {
        error: false,
        message: 'Entidades financieras obtenidas correctamente',
        data: financialEntities,
      };
    } catch (error) {
      return {
        error: true,
        message: 'Error al obtener las entidades financieras',
        data: null,
      };
    }
  }
}
