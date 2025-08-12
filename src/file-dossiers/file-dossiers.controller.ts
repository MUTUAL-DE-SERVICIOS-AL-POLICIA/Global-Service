import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileDossiersService } from './file-dossiers.service';

/**
 * Controlador que maneja los mensajes entrantes relacionados con los Documentos de Trámite(FileDossiers)
 * dentro de un contexto de microservicio.
 */
@Controller()
export class FileDossiersController {
  /**
   * Constructor del controlador FileDossiersController.
   * Inyecta el servicio FileDossiersService
   * @param fileDossiersService Servicio encargado de la lógica de negocio de los Documentos de Trámite.
   */
  constructor(private readonly fileDossiersService: FileDossiersService) {}

  /**
   * **Maneja el patrón de mensaje NATS 'fileDossiers.findAll'.**
   * Delega la búsqueda de todos los Documentos de Trámite que cumplen los criterios de filtro al FileDossiersService.
   * @returns Una promesa que resuelve con un array de objetos ProcedureDocument.
   */
  @MessagePattern('fileDossiers.findAll')
  findAll(@Payload() columns: string[]) {
    return this.fileDossiersService.findAll(columns);
  }

  /**
   * **Maneja el patrón de mensaje NATS 'fileDossiers.findOne'.**
   * Busca un Documento de Trámite específico por su ID, utilizando el FileDossiersService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico del Documento de Trámite extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto ProcedureDocument completo si es encontrado,
   */
  @MessagePattern('fileDossiers.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.fileDossiersService.findOne(id);
  }

  /**
   * **Maneja el patrón de mensaje NATS 'fileDossiers.findAllByIds'.**
   * Busca Documentos de Trámite por una lista de IDs proporcionada en el payload,
   * utilizando el FileDossiersService, y devuelve un mapa con información seleccionada.
   * @param data El objeto payload del mensaje. Se espera que contenga una propiedad 'ids' que sea un array de números.
   * @param data.ids El array de IDs numéricos de los documentos a buscar.
   * @returns Una promesa que resuelve con un objeto (mapa) donde las claves son los IDs de los documentos encontrados
   * y los valores son objetos `{ name: string; shortened: string }`.
   */
  @MessagePattern('fileDossiers.findAllByIds')
  async findAllByIds(data: { ids: number[]; columns?: string[] }) {
    return this.fileDossiersService.findAllByIds(data.ids, data.columns);
  }
}
