import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm'; // Importaciones de TypeORM usadas en queries
import { ProcedureDocument } from './entities/procedure-document.entity';
import { RpcException } from '@nestjs/microservices';

/**
 * Servicio encargado de la lógica de negocio relacionada con los Documentos de Trámite(ProcedureDocuments).
 * Proporciona métodos para consultar información de documentos desde la base de datos,
 * incluyendo filtros por campos no nulos/vacíos y búsqueda por lista de IDs.
 */
@Injectable()
export class ProcedureDocumentsService {
  /**
   * Instancia del Logger para registrar información o errores específicos de este servicio.
   */
  private readonly logger = new Logger('ProcedureDocumentsService');

  /**
   * Constructor del servicio ProcedureDocumentsService.
   * Inyecta el repositorio de TypeORM para la entidad ProcedureDocument.
   * @param procedureDocumentsRepository Repositorio de TypeORM para la entidad ProcedureDocument.
   */
  constructor(
    @InjectRepository(ProcedureDocument)
    private readonly procedureDocumentsRepository: Repository<ProcedureDocument>,
  ) {}

  /**
   * Busca y devuelve una lista parcial de todos los Documentos de Trámite disponibles.
   * Filtra los documentos para incluir solo aquellos donde el campo 'shortened' no es nulo ni una cadena vacía.
   * Selecciona los campos 'id', 'name' y 'shortened'.
   * @returns Una promesa que resuelve con un array de objetos ProcedureDocument parciales que cumplen el criterio de filtro.
   */
  async findAll(): Promise<Partial<ProcedureDocument>[]> {
    return this.procedureDocumentsRepository.find({
      select: ['id', 'name', 'shortened'],
      where: [{ shortened: Not(IsNull()) }, { shortened: Not('') }], // Condición para que 'shortened' no sea nulo o vacío
    });
  }

  /**
   * Busca y devuelve un Documento de Trámite específico por su ID.
   * Si el documento no es encontrado, lanza una excepción RpcException.
   * @param id El ID numérico del Documento de Trámite a buscar.
   * @returns Una promesa que resuelve con el objeto ProcedureDocument completo si es encontrado.
   * @throws RpcException Si no se encuentra un Documento de Trámite con el ID proporcionado (código 404).
   */
  async findOne(id: number): Promise<ProcedureDocument> {
    const procedureDocument = await this.procedureDocumentsRepository.findOneBy(
      { id },
    );

    if (!procedureDocument)
      throw new RpcException({
        message: `Documento with: ${id} not found`, // Nota: Mensaje usa "Documento" en lugar de "ProcedureDocument"
        code: 404,
      });

    return procedureDocument;
  }

  /**
   * Busca Documentos de Trámite por una lista de IDs y devuelve un mapa con la información seleccionada.
   * El mapa resultante tiene los IDs de los documentos como claves y objetos con 'name' y 'shortened' como valores.
   * @param ids Un array de números representando los IDs de los documentos a buscar.
   * @returns Una promesa que resuelve con un objeto (mapa) donde las claves son los IDs de los documentos encontrados
   * y los valores son objetos `{ name: string; shortened: string }`. Si no se encuentran documentos para los IDs proporcionados, el mapa estará vacío o contendrá solo los encontrados.
   */
  async findAllByIds(
    ids: number[],
  ): Promise<Record<number, { name: string; shortened: string }>> {
    // Busca documentos cuyos IDs estén en la lista proporcionada
    const documents = await this.procedureDocumentsRepository.findBy({
      id: In(ids), // Usa el operador In de TypeORM
    });

    // Transforma el array de documentos encontrados a un mapa
    const result = documents.reduce(
      (acc: Record<number, { name: string; shortened: string }>, doc) => {
        acc[doc.id] = {
          name: doc.name,
          shortened: doc.shortened || '', // Asegura que shortened sea un string vacío si es null/undefined
        };
        return acc;
      },
      {}, // Inicia el acumulador como un objeto vacío
    );

    return result;
  }
}
