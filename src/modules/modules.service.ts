import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module, ProcedureModality, ProcedureType } from './entities'; // Asumiendo que están en './entities'
import { RpcException } from '@nestjs/microservices';

/**
 * Servicio encargado de la lógica de negocio relacionada con Módulos(Modules), Tipos de Trámite(ProcedureType)
 * y Modalidades de Trámite(ProcedureModality). Proporciona métodos para consultar información de estas
 * entidades desde la base de datos y un método genérico de búsqueda con relaciones.
 */
@Injectable()
export class ModulesService {
  /**
   * Constructor del servicio ModulesService.
   * Inyecta los repositorios de TypeORM.
   * @param moduleRepository Repositorio para la entidad Module.
   * @param procedureTypeRepository Repositorio para la entidad ProcedureType.
   * @param procedureModalityRepository Repositorio para la entidad ProcedureModality.
   */
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
    @InjectRepository(ProcedureType)
    private readonly procedureTypeRepository: Repository<ProcedureType>,
    @InjectRepository(ProcedureModality)
    private readonly procedureModalityRepository: Repository<ProcedureModality>,
  ) {}

  /**
   * Busca y devuelve una lista de todos los Módulos disponibles.
   * @returns Una promesa que resuelve con un array de objetos Module.
   */
  async findAllModules(): Promise<Module[]> {
    return this.moduleRepository.find();
  }

  /**
   * Busca y devuelve un Módulo específico por su ID.
   * @param id El ID numérico del Módulo a buscar.
   * @returns Una promesa que resuelve con el objeto Module completo si es encontrado.
   * @throws RpcException Si no se encuentra un Módulo con el ID proporcionado (código 404).
   */
  async findOneModules(id: number): Promise<Module> {
    const module = await this.moduleRepository.findOne({
      where: { id },
    });
    if (!module)
      throw new RpcException({
        message: `Module with id ${id} not found`,
        code: 404,
      });

    return module;
  }

  /**
   * Busca y devuelve una lista de todos los Tipos de Trámite (ProcedureTypes).
   * @returns Una promesa que resuelve con un array de objetos ProcedureType.
   */
  async findAllProcedureTypes(): Promise<ProcedureType[]> {
    return this.procedureTypeRepository.find();
  }

  /**
   * Busca y devuelve un Tipo de Trámite (ProcedureType) específico por su ID.
   * @param id El ID numérico del Tipo de Trámite a buscar.
   * @returns Una promesa que resuelve con el objeto ProcedureType completo si es encontrado.
   * @throws RpcException Si no se encuentra un Tipo de Trámite con el ID proporcionado (código 404).
   */
  async findOneProcedureTypes(id: number): Promise<ProcedureType> {
    const procedureType = await this.procedureTypeRepository.findOne({
      where: { id },
    });
    if (!procedureType)
      throw new RpcException({
        message: `ProcedureType with id ${id} not found`,
        code: 404,
      });
    return procedureType;
  }

  /**
   * Busca y devuelve una lista de todas las Modalidades de Trámite (ProcedureModality).
   * @returns Una promesa que resuelve con un array de objetos ProcedureModality.
   */
  async findAllProcedureModalities(): Promise<ProcedureModality[]> {
    return this.procedureModalityRepository.find();
  }

  /**
   * Busca y devuelve una Modalidad de Trámite (ProcedureModality) específica por su ID.
   * @param id El ID numérico de la Modalidad de Trámite a buscar.
   * @returns Una promesa que resuelve con el objeto ProcedureModality completo si es encontrado.
   * @throws RpcException Si no se encuentra una Modalidad de Trámite con el ID proporcionado (código 404).
   */
  async findOneProcedureModalities(id: number): Promise<ProcedureModality> {
    const module = await this.procedureModalityRepository.findOne({
      where: { id },
    });
    if (!module) {
      throw new RpcException({
        message: `ProcedureModality with id ${id} not found`,
        code: 404,
      });
    }
    return module;
  }

  /**
   * Método genérico para buscar una entidad (Módulo, Tipo de Trámite o Modalidad de Trámite) por su ID y cargar relaciones especificadas.
   * @param id El ID numérico de la entidad a buscar.
   * @param relations Un array de strings con los nombres de las relaciones a cargar.
   * @param entity El nombre de la entidad a buscar ('module', 'procedureType', o 'procedureModality').
   * @returns Una promesa que resuelve con el objeto de la entidad encontrada (con las relaciones cargadas). El tipo de retorno es `any` debido a la naturaleza genérica de la búsqueda.
   * @throws RpcException Si no se encuentra la entidad con el ID proporcionado (código 404).
   */
  async findAndVerifyModuleWithRelations(
    id: number,
    relations: string[],
    entity: 'module' | 'procedureType' | 'procedureModality',
  ): Promise<any> {
    const repository = this[`${entity}Repository`];
    if (!repository) {
      throw new RpcException({
        message: `Invalid entity type: ${entity}`,
        code: 400,
      });
    }

    const response = await repository.findOne({
      where: { id },
      relations: relations.length > 0 ? relations : [], // Carga relaciones si el array no está vacío
    });

    if (!response) {
      throw new RpcException({
        message: `${entity} with ID: ${id} not found`,
        code: 404,
      });
    }

    return response;
  }
}
