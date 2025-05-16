import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NATS_SERVICE } from '../../config'; // Asumiendo que NATS_SERVICE es un token de inyección

/**
 * Servicio de utilidad para interactuar con un microservicio NATS.
 * Proporciona métodos para enviar mensajes y procesar respuestas, incluyendo manejo básico de errores.
 */
export class NatsService {
  /**
   * Instancia del Logger para registrar información o errores del servicio.
   * Se utiliza el contexto 'MicroserviceUtils'.
   */
  private logger = new Logger('MicroserviceUtils');

  /**
   * Constructor del servicio NatsService.
   * Inyecta el cliente NATS ClientProxy utilizando el token NATS_SERVICE.
   * @param client Proxy del cliente de microservicio NATS utilizado para enviar mensajes.
   */
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  /**
   * Envía un mensaje a un servicio NATS específico y espera la primera respuesta.
   * Utiliza `firstValueFrom` para convertir el Observable de respuesta a una Promesa.
   * Incluye manejo de errores para capturar excepciones durante la llamada al microservicio.
   *
   * Si la llamada es exitosa, la respuesta incluirá `{ status: true }`.
   * Si ocurre un error, devuelve `{ status: false, message: 'Microservice call failed' }` y registra el error.
   *
   * @param service El patrón del servicio NATS al que enviar el mensaje (ej. 'users.findOne').
   * @param data Los datos a enviar como payload del mensaje.
   * @returns Una promesa que resuelve con la respuesta del microservicio (con `status: true` o `status: false`) o un objeto de error.
   */
  async firstValue(service: string, data: any): Promise<any> {
    return firstValueFrom(
      this.client.send(service, data).pipe(
        map((response) => ({
          ...response,
          status: true, // Añade un indicador de estado exitoso
        })),
        catchError((error) => {
          // Captura errores del Observable y los registra
          this.logger.error(
            `Error calling microservice: ${service}`,
            error.message,
          );
          // Devuelve un Observable con un objeto de error y estado falso
          return of({
            status: false,
            message: 'Microservice call failed',
          });
        }),
      ),
    );
  }

  /**
   * Busca una entidad por su ID utilizando un servicio NATS específico y elimina ciertas claves de la respuesta.
   * Si el `entityId` es nulo o la respuesta del servicio es nula, devuelve nulo.
   *
   * @param entityId El ID de la entidad a buscar (puede ser undefined).
   * @param service El patrón del servicio NATS para buscar la entidad (ej. 'products.findOne').
   * @param keysToOmit Un array de strings con los nombres de las claves a eliminar del objeto de respuesta.
   * @returns Una promesa que resuelve con el objeto de la entidad (sin las claves omitidas) o null si no se encuentra o falla la búsqueda.
   */
  async fetchAndClean(
    entityId: number | undefined,
    service: string,
    keysToOmit: string[],
  ) {
    if (!entityId) return null; // Si no hay ID, devuelve null inmediatamente

    // Llama al microservicio para obtener los datos de la entidad
    const data = await this.firstValue(service, { id: entityId });

    if (!data) return null; // Si la respuesta del servicio es nula, devuelve null

    // Elimina las claves especificadas del objeto de datos
    keysToOmit.forEach((key) => delete data[key]);

    return data; // Devuelve los datos limpios
  }
}
