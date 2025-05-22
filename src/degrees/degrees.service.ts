import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Degree, Hierarchy } from './entities'; // Asumiendo que Degree y Hierarchy están en './entities'
import { RpcException } from '@nestjs/microservices';

/**
 * Servicio encargado de la lógica de negocio relacionada con los Grados (Degrees)
 * y las Jerarquías (Hierarchies).
 * Proporciona métodos para consultar información de ambas entidades desde la base de datos.
 */
@Injectable()
export class DegreesService {
  /**
   * Instancia del Logger para registrar información o errores específicos de este servicio.
   */
  private readonly logger = new Logger('DegreesService');

  /**
   * Constructor del servicio DegreesService.
   * Inyecta los repositorios de TypeORM para las entidades Degree y Hierarchy.
   * @param degreesRepository Repositorio de TypeORM para la entidad Degree.
   * @param hierarchiesRepository Repositorio de TypeORM para la entidad Hierarchy.
   */
  constructor(
    @InjectRepository(Degree)
    private readonly degreesRepository: Repository<Degree>,
    @InjectRepository(Hierarchy)
    private readonly hierarchiesRepository: Repository<Hierarchy>,
  ) {}

  /**
   * Busca y devuelve una lista parcial de todos los Grados (Degrees) disponibles.
   * Selecciona solo los campos 'code' y 'name'.
   * @returns Una promesa que resuelve con un array de objetos Degree con campos 'code' y 'name'.
   */
  async findAllDegrees(): Promise<Partial<Degree>[]> {
    return this.degreesRepository.find({
      select: ['code', 'name'],
    });
  }

  /**
   * Busca y devuelve un Grado (Degree) específico por su ID que incluye la relación 'hierarchy'.
   * Si el grado no es encontrado lanza una excepción RpcException(codigo 404).
   * @param id El ID numérico del Grado a buscar.
   * @returns Una promesa que resuelve con el objeto Degree completo (incluyendo la relación 'hierarchy') si es encontrado.
   * @throws RpcException Si no se encuentra un Grado con el ID proporcionado (código 404).
   */
  async findOneDegrees(id: number): Promise<Degree> {
    const degree = await this.degreesRepository.findOne({
      where: { id },
      relations: ['hierarchy'], // Carga la relación con Hierarchy
    });

    if (!degree)
      throw new RpcException({
        message: `Degree with: ${id} not found`,
        code: 404,
      });

    return degree;
  }

  /**
   * Busca y devuelve una lista parcial de todas las Jerarquías (Hierarchies) disponibles.
   * Selecciona solo los campos 'code' y 'name'.
   * @returns Una promesa que resuelve con un array de objetos Hierarchy con campos 'code' y 'name'.
   */
  async findAllHierarchies(): Promise<Partial<Hierarchy>[]> {
    return this.hierarchiesRepository.find({
      select: ['code', 'name'],
    });
  }

  /**
   * Busca y devuelve una Jerarquía (Hierarchy) específica por su ID que incluye la relación 'degrees'.
   * Si la jerarquía no es encontrada, lanza una excepción RpcException(codigo 404).
   * @param id El ID numérico de la Jerarquía a buscar.
   * @returns Una promesa que resuelve con el objeto Hierarchy completo (incluyendo la relación 'degrees') si es encontrado.
   * @throws RpcException Si no se encuentra una Jerarquía con el ID proporcionado (código 404).
   */
  async findOneHierarchies(id: number): Promise<Hierarchy> {
    const hierarchy = await this.hierarchiesRepository.findOne({
      where: { id },
      relations: ['degrees'], // Carga la relación con Degrees
    });

    if (!hierarchy)
      throw new RpcException({
        message: `Hierarchy with: ${id} not found`,
        code: 404,
      });

    return hierarchy;
  }
}
