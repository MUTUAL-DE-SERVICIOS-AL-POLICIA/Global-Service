import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

/**
 * Servicio encargado de la lógica de negocio relacionada con las ciudades.
 * Proporciona métodos para consultar información de ciudades desde la base de datos.
 */
@Injectable()
export class CitiesService {
  /**
   * Constructor del servicio CitiesService.
   * Inyecta el repositorio de TypeORM para la entidad City.
   * @param citiesRepository utilizado para interactuar con la tabla 'city'.
   */
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
  ) {}

  /**
   * Busca y devuelve una lista de todas las ciudades disponibles.
   * Selecciona solo los campos seleccionados para una vista general.
   * @returns Una promesa que resuelve con un array de objetos City conteniendo solo campos seleccionados.
   */
  async findAll(columns?: string[]): Promise<Partial<City>[]> {
    if (columns && columns.length > 0) {
      return this.citiesRepository.find({
        select: columns as (keyof City)[],
      });
    }
    return this.citiesRepository.find();
  }

  /**
   * Busca y devuelve una ciudad específica por su ID.
   * Si la ciudad no es encontrada, lanza una excepción RpcException(codigo 404).
   * @param id El ID numérico de la ciudad a buscar.
   * @returns Una promesa que resuelve con el objeto City completo si es encontrado.
   * @throws RpcException Si no se encuentra una ciudad con el ID proporcionado (código 404).
   */
  async findOne(id: number): Promise<City> {
    const city = await this.citiesRepository.findOneBy({ id });

    if (!city) {
      throw new RpcException({
        message: `City with ID: ${id} not found`,
        code: 404,
      });
    }
    return city;
  }
}
