import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProcedureDocumentsService } from './procedure-documents.service';

/**
 * Controlador que maneja los mensajes entrantes relacionados con los Documentos de Trámite(ProcedureDocuments)
 * dentro de un contexto de microservicio.
 */
@Controller()
export class ProcedureDocumentsController {
  /**
   * Constructor del controlador ProcedureDocumentsController.
   * Inyecta el servicio ProcedureDocumentsService
   * @param procedureDocumentsService Servicio encargado de la lógica de negocio de los Documentos de Trámite.
   */
  constructor(
    private readonly procedureDocumentsService: ProcedureDocumentsService,
  ) {}

  /**
   * **Maneja el patrón de mensaje NATS 'procedureDocuments.findAll'.**
   * Delega la búsqueda de todos los Documentos de Trámite que cumplen los criterios de filtro al ProcedureDocumentsService.
   * @returns Una promesa que resuelve con un array de objetos ProcedureDocument.
   */
  @MessagePattern('procedureDocuments.findAll')
  findAll() {
    return this.procedureDocumentsService.findAll();
  }

  /**
   * **Maneja el patrón de mensaje NATS 'procedureDocuments.findOne'.**
   * Busca un Documento de Trámite específico por su ID, utilizando el ProcedureDocumentsService.
   * Aplica un pipe para asegurar que el payload 'id' sea un número entero.
   * @param id El ID numérico del Documento de Trámite extraído del payload del mensaje.
   * @returns Una promesa que resuelve con el objeto ProcedureDocument completo si es encontrado,
   */
  @MessagePattern('procedureDocuments.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.procedureDocumentsService.findOne(id);
  }

  /**
   * **Maneja el patrón de mensaje NATS 'procedureDocuments.findAllByIds'.**
   * Busca Documentos de Trámite por una lista de IDs proporcionada en el payload,
   * utilizando el ProcedureDocumentsService, y devuelve un mapa con información seleccionada.
   * @param data El objeto payload del mensaje. Se espera que contenga una propiedad 'ids' que sea un array de números.
   * @param data.ids El array de IDs numéricos de los documentos a buscar.
   * @returns Una promesa que resuelve con un objeto (mapa) donde las claves son los IDs de los documentos encontrados
   * y los valores son objetos `{ name: string; shortened: string }`.
   */
  @MessagePattern('procedureDocuments.findAllByIds')
  async findAllByIds(data: {
    ids: number[];
    columns?: string[];
  }) {
    return this.procedureDocumentsService.findAllByIds(data.ids, data.columns);
  }
}
