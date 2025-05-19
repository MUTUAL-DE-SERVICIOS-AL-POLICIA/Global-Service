import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UnitsService } from './units.service';

/**
 * Controlador que maneja los mensajes entrantes relacionados con Unidades (Units)
 * y Desgloses (Breakdowns) dentro de un contexto de microservicio.
 */
@Controller()
export class UnitsController {
  /**
   * Constructor del controlador UnitsController.
   * Inyecta el servicio UnitsService para manejar la lógica de negocio.
   * @param unitsService Servicio encargado de la lógica de negocio de Unidades y Desgloses.
   */
  constructor(private readonly unitsService: UnitsService) {}

  /**
   * **Maneja el patrón de mensaje NATS 'units.findAll'.**
   * Delega la búsqueda de todas las Unidades al UnitsService.
   * @returns Una promesa que resuelve con un array de objetos Unit parciales.
   */
  @MessagePattern('units.findAll')
  findAllUnits() {
    return this.unitsService.findAllUnits();
  }

  /**
   * **Maneja el patrón de mensaje NATS 'units.findOne'.**
   * Busca una Unidad específica por su ID, utilizando el UnitsService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico de la Unidad extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto Unit completo (con relaciones) si es encontrado,
   * o lanza una RpcException si no se encuentra.
   */
  @MessagePattern('units.findOne')
  findOneUnits(@Payload('id', ParseIntPipe) id: number) {
    return this.unitsService.findOneUnits(id);
  }

  /**
   * **Maneja el patrón de mensaje NATS 'breakdowns.findAll'.**
   * Delega la búsqueda de todos los Desgloses al UnitsService.
   * @returns Una promesa que resuelve con un array de objetos Breakdown parciales.
   */
  @MessagePattern('breakdowns.findAll')
  findAllBreakdowns() {
    return this.unitsService.findAllBreakdowns();
  }

  /**
   * **Maneja el patrón de mensaje NATS 'breakdowns.findOne'.**
   * Busca un Desglose específico por su ID, utilizando el UnitsService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico del Desglose extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto Breakdown completo (con relaciones) si es encontrado,
   * o lanza una RpcException si no se encuentra.
   */
  @MessagePattern('breakdowns.findOne')
  findOneBreakdowns(@Payload('id', ParseIntPipe) id: number) {
    return this.unitsService.findOneBreakdowns(id);
  }
}
