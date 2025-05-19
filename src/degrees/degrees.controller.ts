import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DegreesService } from './degrees.service';

/**
 * Controlador que maneja los mensajes entrantes relacionados con Grados (Degrees)
 * y Jerarquías (Hierarchies) dentro de un contexto de microservicio.
 * Delega la lógica de negocio al DegreesService.
 */
@Controller()
export class DegreesController {
  /**
   * Constructor del controlador DegreesController.
   * Inyecta el servicio DegreesService para manejar la lógica de negocio.
   * @param degreesService Servicio encargado de la lógica de negocio de Grados y Jerarquías.
   */
  constructor(private readonly degreesService: DegreesService) {}

  /**
   * Maneja el mensaje de microservicio con el patrón 'degrees.findAll'.
   * Delega la búsqueda de todos los Grados al DegreesService.
   * @returns Una promesa que resuelve con un array de objetos Degree parciales.
   */
  @MessagePattern('degrees.findAll')
  findAllUnits() {
    return this.degreesService.findAllDegrees();
  }

  /**
   * Maneja el mensaje de microservicio con el patrón 'degrees.findOne'.
   * Busca un Grado específico por su ID utilizando el DegreesService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico del Grado extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto Degree completo si es encontrado, o lanza una RpcException si no se encuentra.
   */
  @MessagePattern('degrees.findOne')
  findOneUnits(@Payload('id', ParseIntPipe) id: number) {
    return this.degreesService.findOneDegrees(id);
  }

  /**
   * Maneja el mensaje de microservicio con el patrón 'hierarchies.findAll'.
   * Delega la búsqueda de todas las Jerarquías al DegreesService.
   * @returns Una promesa que resuelve con un array de objetos Hierarchy parciales.
   */
  @MessagePattern('hierarchies.findAll')
  findAllHierarchies() {
    return this.degreesService.findAllHierarchies();
  }

  /**
   * Maneja el mensaje de microservicio con el patrón 'hierarchies.findOne'.
   * Busca una Jerarquía específica por su ID utilizando el DegreesService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico de la Jerarquía extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto Hierarchy completo si es encontrado, o lanza una RpcException si no se encuentra.
   */
  @MessagePattern('hierarchies.findOne')
  findOneHierarchies(@Payload('id', ParseIntPipe) id: number) {
    return this.degreesService.findOneHierarchies(id);
  }
}
