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
   */
  private readonly logger = new Logger('UnitsService');

  /**
   * Constructor del servicio UnitsService.
   * Inyecta los repositorios de TypeORM.
   * @param unitsRepository Repositorio para la entidad Unit.
   * @param breakdownsRepository Repositorio para la entidad Breakdown.
   */
  constructor(
    @InjectRepository(Unit)
    private readonly unitsRepository: Repository<Unit>,
    @InjectRepository(Breakdown)
    private readonly breakdownsRepository: Repository<Breakdown>,
  ) {}

  /**
   * Busca y devuelve una lista de todas las Unidades (Units) selecciona solo los campos 'code' y 'name'.
   * @returns Una promesa que resuelve con un array de objetos Unit('code' y 'name').
   */
  async findAllUnits(): Promise<Partial<Unit>[]> {
    return this.unitsRepository.find({
      select: ['code', 'name'],
    });
  }

  /**
   * Busca y devuelve una Unidad(Unit) específica por su ID incluye la relación 'breakdown'.
   * @param id El ID numérico de la Unidad a buscar.
   * @returns Una promesa que resuelve con el objeto Unit (incluyendo la relación 'breakdown') si es encontrado.
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
   * Busca y devuelve una lista de todos los Desgloses(Breakdowns) y selecciona solo los campos 'code' y 'name'.
   * @returns Una promesa que resuelve con un array de objetos Breakdown.
   */
  async findAllBreakdowns(): Promise<Partial<Breakdown>[]> {
    return this.breakdownsRepository.find({
      select: ['code', 'name'],
    });
  }

  /**
   * Busca y devuelve un Desglose(Breakdown) específico por su ID incluye la relación 'units'.
   * @param id El ID numérico del Desglose a buscar.
   * @returns Una promesa que resuelve con el objeto Breakdown (incluyendo la relación 'units') si es encontrado.
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
