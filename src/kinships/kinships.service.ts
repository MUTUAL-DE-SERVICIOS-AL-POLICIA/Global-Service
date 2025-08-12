import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kinship } from './entities/kinship.entity';
import { In, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

/**
 * Servicio encargado de la lógica de negocio relacionada con los Parentescos (Kinships).
 * Proporciona métodos para consultar información de (Kinship) desde la base de datos.
 */
@Injectable()
export class KinshipsService {
  /**
   * Constructor del servicio KinshipsService.
   * Inyecta el repositorio de TypeORM para la entidad Kinship.
   * @param kinshipsRepository Repositorio de TypeORM para la entidad Kinship.
   */
  constructor(
    @InjectRepository(Kinship)
    private readonly kinshipsRepository: Repository<Kinship>,
  ) {}

  /**
   * Busca y devuelve una lista de todos los Parentescos (Kinships) disponibles.
   * Selecciona solo los campos 'id' y 'name'.
   * @returns Una promesa que resuelve con un array de objetos Kinship con solo los campos 'id' y 'name'.
   */
  async findAll(): Promise<Partial<Kinship>[]> {
    return this.kinshipsRepository.find({
      select: ['id', 'name'],
    });
  }

  /**
   * Busca y devuelve un Parentesco (Kinship) específico por su ID.
   * Si el parentesco no es encontrado, lanza una excepción RpcException(codigo 404).
   * @param id El ID numérico del Parentesco a buscar.
   * @returns Una promesa que resuelve con el objeto Kinship completo si es encontrado.
   * @throws RpcException Si no se encuentra un Parentesco con el ID proporcionado (código 404).
   */
  async findOne(id: number): Promise<Kinship> {
    const kinship = await this.kinshipsRepository.findOneBy({ id });

    if (!kinship)
      throw new RpcException({
        message: `Kinship with ${id} not found`,
        code: 404,
      });

    return kinship;
  }

  async findAllByIds(
    ids: number[],
  ): Promise<Record<number, { id: number; name: string }>> {
    const kinships = await this.kinshipsRepository.findBy({ id: In(ids) });

    return kinships.reduce(
      (acc, k) => {
        acc[k.id] = { id: k.id, name: k.name };
        return acc;
      },
      {} as Record<number, { id: number; name: string }>,
    );
  }
}
