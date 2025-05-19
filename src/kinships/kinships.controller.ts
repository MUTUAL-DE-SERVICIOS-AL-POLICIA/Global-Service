import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KinshipsService } from './kinships.service';

/**
 * Controlador que maneja los mensajes entrantes relacionados con los Parentescos (Kinships)
 * dentro de un contexto de microservicio.
 */
@Controller()
export class KinshipsController {
  /**
   * Constructor del controlador KinshipsController.
   * Inyecta el servicio KinshipsService para manejar la lógica de negocio.
   * @param kinshipsService Servicio encargado de la lógica de negocio de los (Kinship).
   */
  constructor(private readonly kinshipsService: KinshipsService) {}

  /**
   * **Maneja el patrón de mensaje NATS 'kinships.findAll'.**
   * Delega la búsqueda de todos los Parentescos(Kinships) al KinshipsService.
   * @returns Una promesa que resuelve con un array de objetos Kinship parciales.
   */
  @MessagePattern('kinships.findAll')
  findAll() {
    return this.kinshipsService.findAll();
  }

  /**
   * **Maneja el patrón de mensaje NATS 'kinships.findOne'.**
   * Busca un Parentesco(Kinship) específico por su ID, utilizando el KinshipsService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico del Parentesco extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto Kinship completo si es encontrado,
   * o lanza una RpcException si no se encuentra.
   */
  @MessagePattern('kinships.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.kinshipsService.findOne(id);
  }
}
