import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breakdown, Unit } from './entities';
import { RpcException } from '@nestjs/microservices';

/**
 * Servicio encargado de la lógica de negocio relacionada con Unidades (Units)
 * y Desgloses (Breakdowns). Proporciona métodos para consultar información
 * de ambas entidades desde la base de datos.
 */
@Injectable()
export class UnitsService {
  /**
   * Instancia del Logger para registrar información o errores específicos de este servicio.
   * Nota: El nombre del logger es 'BreakdownService', quizás heredado. Considera si un nombre
   * más acorde con 'UnitsService' sería más claro.
   */
  private readonly logger = new Logger('BreakdownService');

  /**
   * Constructor del servicio UnitsService.
   * Inyecta los repositorios de TypeORM para las entidades Unit y Breakdown.
   * @param unitsRepository Repositorio de TypeORM para la entidad Unit.
   * @param breakdownsRepository Repositorio de TypeORM para la entidad Breakdown.
   */
  constructor(
    @InjectRepository(Unit)
    private readonly unitsRepository: Repository<Unit>,
    @InjectRepository(Breakdown)
    private readonly breakdownsRepository: Repository<Breakdown>,
  ) {}

  /**
   * Busca y devuelve una lista parcial de todas las Unidades (Units) disponibles.
   * Selecciona solo los campos 'code' y 'name'.
   * @returns Una promesa que resuelve con un array de objetos Unit parciales.
   */
  async findAllUnits(): Promise<Partial<Unit>[]> {
    return this.unitsRepository.find({
      select: ['code', 'name'],
    });
  }

  /**
   * Busca y devuelve una Unidad (Unit) específica por su ID.
   * Incluye la relación 'breakdown'.
   * Si la unidad no es encontrada, lanza una excepción RpcException.
   * @param id El ID numérico de la Unidad a buscar.
   * @returns Una promesa que resuelve con el objeto Unit completo (incluyendo la relación 'breakdown') si es encontrado.
   * @throws RpcException Si no se encuentra una Unidad con el ID proporcionado (código 404).
   */
  async findOneUnits(id: number): Promise<Unit> {
    const unit = await this.unitsRepository.findOne({
      where: { id },
      relations: ['breakdown'], // Carga la relación con Breakdown
    });

    if (!unit)
      throw new RpcException({
        message: `Unit with: ${id} not found`,
        code: 404,
      });

    return unit;
  }

  /**
   * Busca y devuelve una lista parcial de todos los Desgloses (Breakdowns) disponibles.
   * Selecciona solo los campos 'code' y 'name'.
   * @returns Una promesa que resuelve con un array de objetos Breakdown parciales.
   */
  async findAllBreakdowns(): Promise<Partial<Breakdown>[]> {
    return this.breakdownsRepository.find({
      select: ['code', 'name'],
    });
  }

  /**
   * Busca y devuelve un Desglose (Breakdown) específico por su ID.
   * Incluye la relación 'units'.
   * Si el desglose no es encontrado, lanza una excepción RpcException.
   * @param id El ID numérico del Desglose a buscar.
   * @returns Una promesa que resuelve con el objeto Breakdown completo (incluyendo la relación 'units') si es encontrado.
   * @throws RpcException Si no se encuentra un Desglose con el ID proporcionado (código 404).
   */
  async findOneBreakdowns(id: number): Promise<Breakdown> {
    const breakdown = await this.breakdownsRepository.findOne({
      where: { id },
      relations: ['units'], // Carga la relación con Units
    });

    if (!breakdown)
      throw new RpcException({
        message: `Breakdown with: ${id} not found`,
        code: 404,
      });

    return breakdown;
  }
}
