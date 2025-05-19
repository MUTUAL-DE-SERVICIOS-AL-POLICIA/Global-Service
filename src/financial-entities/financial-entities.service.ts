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

  /**
   * Busca y devuelve una lista parcial de todas las Entidades Financieras disponibles.
   * Selecciona solo los campos 'id' y 'name'.
   * @returns Una promesa que resuelve con un array de objetos FinancialEntity parciales.
   */
  async findAll(): Promise<Partial<FinancialEntity>[]> {
    return this.financialEntitiesRepository.find({
      select: ['id', 'name'],
    });
  }

  /**
   * Busca y devuelve una Entidad Financiera específica por su ID.
   * Si la entidad financiera no es encontrada, lanza una excepción RpcException.
   * @param id El ID numérico de la Entidad Financiera a buscar.
   * @returns Una promesa que resuelve con el objeto FinancialEntity completo si es encontrado.
   * @throws RpcException Si no se encuentra una Entidad Financiera con el ID proporcionado (código 404).
   */
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
}
