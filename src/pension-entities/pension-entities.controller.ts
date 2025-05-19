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
   * Inyecta el servicio PensionEntitiesService para manejar la lógica de negocio.
   * @param pensionEntitiesService Servicio encargado de la lógica de negocio de las Entidades de Pensión.
   */
  constructor(
    private readonly pensionEntitiesService: PensionEntitiesService,
  ) {}

  /**
   * **Maneja el patrón de mensaje NATS 'pensionEntities.findAll'.**
   * Delega la búsqueda de todas las Entidades de Pensión al PensionEntitiesService.
   * @returns Una promesa que resuelve con un array de objetos PensionEntity parciales.
   */
  @MessagePattern('pensionEntities.findAll')
  findAll() {
    return this.pensionEntitiesService.findAll();
  }

  /**
   * **Maneja el patrón de mensaje NATS 'pensionEntities.findOne'.**
   * Busca una Entidad de Pensión específica por su ID, utilizando el PensionEntitiesService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico de la Entidad de Pensión extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto PensionEntity completo si es encontrado,
   * o lanza una RpcException si no se encuentra.
   */
  @MessagePattern('pensionEntities.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.pensionEntitiesService.findOne(id);
  }
}
