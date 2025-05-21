import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';

/**
 * Controlador que maneja los mensajes entrantes relacionados con las categorías
 * dentro de un contexto de microservicio.
 */
@Controller()
export class CategoriesController {
  /**
   * Constructor del controlador CategoriesController.
   * Inyecta el servicio CategoriesService.
   * @param categoriesService Servicio encargado de la lógica de negocio de las categorías.
   */
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * **Maneja el patron de mensaje NATS 'categories.findAll'.**
   * Delega la búsqueda de todas las categorías al CategoriesService.
   * @returns Una promesa que resuelve con un array de objetos Category.
   */
  @MessagePattern('categories.findAll')
  findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * **Maneja el patrón de mensaje NATS 'categories.findOne'.**
   * Busca una categoría específica por su ID, utilizando el CategoriesService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico de la categoría extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto Category completo si es encontrado,
   * o lanza una RpcException(codigo 404) si no se encuentra.
   */
  @MessagePattern('categories.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }
}
