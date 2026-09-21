import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialEntity } from './entities/financial-entity.entity';
import { IsNull, Repository } from 'typeorm';
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

  async searchByColumn(
    columns: string[],
    filterColumn: string,
    value: unknown,
  ): Promise<{
    error: boolean;
    message: string;
    data: Partial<FinancialEntity> | null;
  }> {
    if (!Array.isArray(columns) || columns.length === 0) {
      return {
        error: true,
        message: 'Debe enviar al menos una columna para devolver',
        data: null,
      };
    }

    const entityColumns = this.financialEntitiesRepository.metadata.columns;
    const findColumn = (columnName: string) =>
      entityColumns.find(
        (column) =>
          column.propertyName === columnName ||
          column.databaseName === columnName,
      );
    const requestedColumns = [...new Set(columns)];
    const resolvedColumns = requestedColumns.map((column) =>
      typeof column === 'string' ? findColumn(column) : undefined,
    );
    const invalidColumnIndex = resolvedColumns.findIndex((column) => !column);

    if (invalidColumnIndex >= 0) {
      return {
        error: true,
        message: `La columna ${String(requestedColumns[invalidColumnIndex])} no es válida para devolver`,
        data: null,
      };
    }

    const resolvedFilterColumn =
      typeof filterColumn === 'string' ? findColumn(filterColumn) : undefined;

    if (!resolvedFilterColumn) {
      return {
        error: true,
        message: `La columna ${String(filterColumn)} no es válida para buscar`,
        data: null,
      };
    }

    if (value === undefined) {
      return {
        error: true,
        message: `El valor para buscar por ${filterColumn} no es válido`,
        data: null,
      };
    }

    const selectedColumns = [
      ...new Set(resolvedColumns.map((column) => column!.propertyName)),
    ] as (keyof FinancialEntity)[];
    const filterProperty = resolvedFilterColumn.propertyName;
    const comparisonValue = value === null ? IsNull() : value;

    try {
      const financialEntity = await this.financialEntitiesRepository.findOne({
        select: selectedColumns,
        where: { [filterProperty]: comparisonValue },
        withDeleted: resolvedFilterColumn.isDeleteDate,
      });

      if (!financialEntity) {
        return {
          error: true,
          message: `No se encontró una entidad financiera con ${filterColumn} = ${String(value)}`,
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
        message: 'Error al buscar la entidad financiera',
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
