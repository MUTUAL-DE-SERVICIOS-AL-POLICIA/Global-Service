import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FinancialEntitiesService } from './financial-entities.service';

/**
 * Controlador que maneja los mensajes entrantes relacionados con las Entidades Financieras
 * dentro de un contexto de microservicio.
 */
@Controller()
export class FinancialEntitiesController {
  /**
   * Constructor del controlador FinancialEntitiesController.
   * Inyecta el servicio FinancialEntitiesService.
   * @param financialEntitiesService Servicio encargado de la lógica de negocio de las Entidades Financieras.
   */
  constructor(
    private readonly financialEntitiesService: FinancialEntitiesService,
  ) {}

  /**
   * **Maneja el patrón de mensaje NATS 'financialEntities.findAll'.**
   * Delega la búsqueda de todas las Entidades Financieras al FinancialEntitiesService.
   * @returns Una promesa que resuelve con un array de objetos FinancialEntity.
   */
  @MessagePattern('financialEntities.findAll')
  findAll() {
    return this.financialEntitiesService.findAll();
  }

  /**
   * **Maneja el patrón de mensaje NATS 'financialEntities.findOne'.**
   * Busca una Entidad Financiera específica por su ID, utilizando el FinancialEntitiesService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico de la Entidad Financiera extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto FinancialEntity completo.
   */
  @MessagePattern('financialEntities.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.financialEntitiesService.findOne(id);
  }
}
