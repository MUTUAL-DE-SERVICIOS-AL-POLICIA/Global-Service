import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PensionEntity } from './entities/pension-entity.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

/**
 * Servicio encargado de la lógica de negocio relacionada con las Entidades de Pensión.
 * Proporciona métodos para consultar información de PensionEntities desde la base de datos.
 */
@Injectable()
export class PensionEntitiesService {
  /**
   * Constructor del servicio PensionEntitiesService.
   * Inyecta el repositorio de TypeORM.
   * @param pensionEntitiesRepository Repositorio para la entidad PensionEntity.
   */
  constructor(
    @InjectRepository(PensionEntity)
    private readonly pensionEntitiesRepository: Repository<PensionEntity>,
  ) {}

  /**
   * Busca y devuelve una lista de todas las PensionEntities disponibles y selecciona los campos 'id', 'type' y 'name'.
   * @returns Una promesa que resuelve con un array de objetos PensionEntity con los campos 'id', 'type' y 'name'.
   */
  async findAll(): Promise<Partial<PensionEntity>[]> {
    return this.pensionEntitiesRepository.find({
      select: ['id', 'type', 'name'],
    });
  }

  /**
   * Busca y devuelve una Entidad de Pensión específica por su ID.
   * @param id El ID numérico de la Entidad de Pensión a buscar.
   * @returns Una promesa que resuelve con el objeto PensionEntity si es encontrado.
   * @throws RpcException Si no se encuentra una Entidad de Pensión con el ID proporcionado (código 404).
   */
  async findOne(id: number): Promise<PensionEntity> {
    const pensionEntity = await this.pensionEntitiesRepository.findOneBy({
      id,
    });
    if (!pensionEntity)
      throw new RpcException({
        message: `PensionEntity with ${id} not found`,
        code: 404,
      });
    return pensionEntity;
  }
}
