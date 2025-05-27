import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PensionEntitiesService } from './pension-entities.service';

/**
 * Controlador que maneja los mensajes entrantes relacionados con las Entidades de Pensión
 * dentro de un contexto de microservicio.
 */
@Controller()
export class PensionEntitiesController {
  /**
   * Constructor del controlador PensionEntitiesController.
   * Inyecta el servicio PensionEntitiesService.
   * @param pensionEntitiesService Servicio encargado de la lógica de negocio de PensionEntities.
   */
  constructor(
    private readonly pensionEntitiesService: PensionEntitiesService,
  ) {}

  /**
   * **Maneja el patrón de mensaje NATS 'pensionEntities.findAll'.**
   * Delega la búsqueda de todas las Entidades de Pensión al PensionEntitiesService.
   * @returns Una promesa que resuelve con un array de objetos PensionEntity.
   */
  @MessagePattern('pensionEntities.findAll')
  findAll() {
    return this.pensionEntitiesService.findAll();
  }

  /**
   * **Maneja el patrón de mensaje NATS 'pensionEntities.findOne'.**
   * Busca una Entidad de Pensión específica por su ID, utilizando el PensionEntitiesService.
   * @param id El ID numérico de la Entidad de Pensión extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto PensionEntity si es encontrado.
   */
  @MessagePattern('pensionEntities.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.pensionEntitiesService.findOne(id);
  }
}
