import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NATS_SERVICE } from '../../config'; // Asumiendo que NATS_SERVICE es un token de inyección

/**
 * Servicio de utilidad para interactuar con un microservicio NATS.
 * Proporciona métodos para enviar mensajes, procesar respuestas y filtrar datos,
 * incluyendo manejo básico de errores y validación de parámetros.
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
   * Valida si un objeto de parámetros es válido y contiene al menos un valor no nulo o indefinido.
   * Es una función de utilidad interna.
   * @param params El objeto a validar.
   * @returns `true` si el objeto es válido y no está vacío (en términos de valores significativos), `false` en caso contrario.
   * @private
   */
  private isValidParams(params: Record<string, unknown>): boolean {
    return (
      params && // Verifica que el objeto no sea nulo ni indefinido
      typeof params === 'object' && // Verifica que sea un objeto
      Object.values(params).some(
        (value) => value !== null && value !== undefined,
      ) // Verifica que al menos un valor no sea nulo/indefinido
    );
  }

  /**
   * Envía un mensaje a un servicio NATS específico y espera la primera respuesta.
   * Utiliza `firstValueFrom` para convertir el Observable de respuesta a una Promesa.
   * Incluye manejo de errores para capturar excepciones durante la llamada al microservicio.
   *
   * Si la llamada es exitosa, la respuesta incluirá `{ serviceStatus: true }`.
   * Si ocurre un error, devuelve `{ serviceStatus: false, message: 'Microservice call failed' }` y registra el error.
   *
   * @param service El patrón del servicio NATS al que enviar el mensaje (ej. 'users.findOne').
   * @param data Los datos a enviar como payload del mensaje.
   * @returns Una promesa que resuelve con la respuesta del microservicio (con `serviceStatus: true` o `serviceStatus: false`) o un objeto de error controlado.
   */
  async firstValue(service: string, data: any): Promise<any> {
    return firstValueFrom(
      this.client.send(service, data).pipe(
        map((response) => ({
          ...response,
          serviceStatus: true, // Añade un indicador de estado exitoso (nombre actualizado)
        })),
        catchError((error) => {
          // Captura errores del Observable y los registra
          this.logger.error(
            `Error calling microservice: ${service}`,
            error.message,
          );
          // Devuelve un Observable con un objeto de error y estado falso
          return of({
            serviceStatus: false,
            message: 'Microservice call failed',
          });
        }),
      ),
    );
  }

  /**
   * Envía parámetros a un servicio NATS, obtiene la respuesta y excluye ciertas claves.
   * Si los parámetros iniciales no son válidos (`isValidParams` retorna false), devuelve `null`.
   * Si la llamada a `firstValue` falla o devuelve nulo, también devuelve `null`.
   * Las claves especificadas en `keysToOmit` son eliminadas del objeto de respuesta.
   *
   * @param params Un objeto con los parámetros a enviar al servicio NATS (típicamente `{ id: number }`).
   * @param service El patrón del servicio NATS al que enviar los parámetros.
   * @param keysToOmit Un array de strings con los nombres de las claves a eliminar del objeto de respuesta.
   * @returns Una promesa que resuelve con el objeto de respuesta del servicio (sin las claves omitidas) o `null` si los parámetros no son válidos o la llamada falla.
   */
  async firstValueExclude(
    params: Record<string, unknown>,
    service: string,
    keysToOmit: string[],
  ): Promise<any | null> {
    if (!this.isValidParams(params)) {
      return null; // Retorna null si los parámetros no son válidos
    }
    const data = await this.firstValue(service, params);
    // Si `firstValue` controló el error y devolvió un objeto con `serviceStatus: false`,
    // ese objeto será procesado aquí, lo cual podría ser el comportamiento deseado.
    // Si `firstValue` devolviera null por algún motivo no manejado (improbable con el catchError), esta línea lo capturaría.
    if (!data) return null;

    // Elimina las claves especificadas del objeto de datos
    keysToOmit.forEach((key) => delete data[key]);
    return data; // Devuelve los datos con las claves omitidas
  }

  /**
   * Envía parámetros a un servicio NATS, obtiene la respuesta y crea un nuevo objeto
   * que contiene solo las claves especificadas.
   * Si los parámetros iniciales no son válidos (`isValidParams` retorna false), devuelve `null`.
   * Si la llamada a `firstValue` falla o devuelve nulo, también devuelve `null`.
   * El objeto retornado incluye solo las claves listadas en `keysToInclude` (si existen en la respuesta original)
   * más la propiedad `serviceStatus` de la respuesta original.
   *
   * @param params Un objeto con los parámetros a enviar al servicio NATS.
   * @param service El patrón del servicio NATS al que enviar los parámetros.
   * @param keysToInclude Un array de strings con los nombres de las claves que se desean mantener en el objeto de respuesta final.
   * @returns Una promesa que resuelve con un nuevo objeto que contiene solo las claves seleccionadas (y serviceStatus) o `null` si los parámetros no son válidos o la llamada falla.
   */
  async firstValueInclude(
    params: Record<string, unknown>,
    service: string,
    keysToInclude: string[],
  ): Promise<any | null> {
    if (!this.isValidParams(params)) {
      return null; // Retorna null si los parámetros no son válidos
    }
    const data = await this.firstValue(service, params);
    // manteniendo esa propiedad en el resultado final.
    if (!data) return null;

    // Crea un nuevo objeto solo con las claves seleccionadas y la propiedad serviceStatus
    const filteredData = Object.fromEntries(
      keysToInclude.filter((key) => key in data).map((key) => [key, data[key]]),
    );

    return {
      ...filteredData,
      serviceStatus: data.serviceStatus, // Incluye la propiedad serviceStatus
    };
  }
}
