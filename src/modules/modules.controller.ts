import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ModulesService } from './modules.service';

/**
 * Controlador que maneja los mensajes entrantes relacionados con Módulos, Tipos de Trámite
 * y Modalidades de Trámite dentro de un contexto de microservicio.
 */
@Controller()
export class ModulesController {
  /**
   * Constructor del controlador ModulesController.
   * Inyecta el servicio ModulesService para manejar la lógica de negocio.
   * @param modulesService Servicio encargado de la lógica de negocio de Módulos, Tipos de Trámite y Modalidades de Trámite.
   */
  constructor(private readonly modulesService: ModulesService) {}

  /**
   * **Maneja el patrón de mensaje NATS 'modules.findAll'.**
   * Delega la búsqueda de todos los Módulos al ModulesService.
   * @returns Una promesa que resuelve con un array de objetos Module completos.
   */
  @MessagePattern('modules.findAll')
  findAllModules() {
    return this.modulesService.findAllModules();
  }

  /**
   * **Maneja el patrón de mensaje NATS 'modules.findOne'.**
   * Busca un Módulo específico por su ID, utilizando el ModulesService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico del Módulo extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto Module completo si es encontrado,
   * o lanza una RpcException si no se encuentra.
   */
  @MessagePattern('modules.findOne')
  findOneModules(@Payload('id', ParseIntPipe) id: number) {
    return this.modulesService.findOneModules(id);
  }

  /**
   * **Maneja el patrón de mensaje NATS 'procedureTypes.findAll'.**
   * Delega la búsqueda de todos los Tipos de Trámite al ModulesService.
   * @returns Una promesa que resuelve con un array de objetos ProcedureType completos.
   */
  @MessagePattern('procedureTypes.findAll')
  findAllProcedureTypes() {
    return this.modulesService.findAllProcedureTypes();
  }

  /**
   * **Maneja el patrón de mensaje NATS 'procedureTypes.findOne'.**
   * Busca un Tipo de Trámite específico por su ID, utilizando el ModulesService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico del Tipo de Trámite extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto ProcedureType completo si es encontrado,
   * o lanza una RpcException si no se encuentra.
   */
  @MessagePattern('procedureTypes.findOne')
  findOneProcedureTypes(@Payload('id', ParseIntPipe) id: number) {
    return this.modulesService.findOneProcedureTypes(id);
  }

  /**
   * **Maneja el patrón de mensaje NATS 'procedureModalities.findAll'.**
   * Delega la búsqueda de todas las Modalidades de Trámite al ModulesService.
   * @returns Una promesa que resuelve con un array de objetos ProcedureModality completos.
   */
  @MessagePattern('procedureModalities.findAll')
  findAllProcedureModalities() {
    return this.modulesService.findAllProcedureModalities();
  }

  /**
   * **Maneja el patrón de mensaje NATS 'procedureModalities.findOne'.**
   * Busca una Modalidad de Trámite específica por su ID, utilizando el ModulesService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico de la Modalidad de Trámite extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto ProcedureModality completo si es encontrado,
   * o lanza una RpcException si no se encuentra.
   */
  @MessagePattern('procedureModalities.findOne')
  findOneProcedureModalities(@Payload('id', ParseIntPipe) id: number) {
    return this.modulesService.findOneProcedureModalities(id);
  }

  /**
   * **Maneja el patrón de mensaje NATS 'modules.findDataRelations'.**
   * Utiliza el servicio para buscar una entidad (Módulo, Tipo de Trámite o Modalidad de Trámite) por ID
   * y cargar relaciones especificadas.
   * @param id El ID numérico de la entidad a buscar, extraído del payload del mensaje y parseado a entero.
   * @param relations Un array de strings con los nombres de las relaciones a cargar, extraído del payload.
   * @param entity El nombre de la entidad a buscar ('module', 'procedureType', o 'procedureModality'), extraído del payload.
   * @returns Una promesa que resuelve con el objeto de la entidad encontrada (con las relaciones cargadas),
   * o lanza una RpcException si no se encuentra o el tipo de entidad es inválido.
   */
  @MessagePattern('modules.findDataRelations')
  findDataRelations(
    @Payload('id', ParseIntPipe) id: number,
    @Payload('relations') relations: string[], // Aseguramos que sea array de strings
    @Payload('entity') entity: 'module' | 'procedureType' | 'procedureModality',
  ) {
    return this.modulesService.findAndVerifyModuleWithRelations(
      id,
      relations,
      entity,
    );
  }
}
