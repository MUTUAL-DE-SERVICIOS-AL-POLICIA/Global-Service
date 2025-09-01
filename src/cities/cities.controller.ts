import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CitiesService } from './cities.service';

/**
 * Controlador que maneja los mensajes entrantes relacionados con las ciudades
 * dentro de un contexto de microservicio.
 */
@Controller()
export class CitiesController {
  /**
   * Constructor del controlador CitiesController.
   * Inyecta el servicio CitiesService.
   * @param citiesService Servicio encargado de la lógica de negocio de las ciudades.
   */
  constructor(private readonly citiesService: CitiesService) {}

  /**
   * **Maneja el patron de mensaje NATS 'cities.findAll'.**
   * Delega la búsqueda de todas las ciudades al CitiesService.
   * @returns Una promesa que resuelve con un array de objetos City.
   */
  @MessagePattern('cities.findAll')
  findAll(@Payload() columns: string[]) {
    return this.citiesService.findAll(columns);
  }

  /**
   * **Maneja el patron de mensaje NATS 'cities.findOne'.**
   * Busca una ciudad específica por su ID, utilizando el CitiesService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico de la ciudad extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto City completo si es encontrado,
   * o lanza una RpcException(codigo 404) si no se encuentra.
   */
  @MessagePattern('cities.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.citiesService.findOne(id);
  }
}
