import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm'; // Importaciones de TypeORM usadas en queries
import { ProcedureDocument } from './entities/procedure-document.entity';
import { RpcException } from '@nestjs/microservices';

/**
 * Servicio encargado de la lógica de negocio relacionada con los Documentos de Trámite(ProcedureDocuments).
 */
@Injectable()
export class ProcedureDocumentsService {
  /**
   * Instancia del Logger para registrar información o errores específicos de este servicio.
   */
  private readonly logger = new Logger('ProcedureDocumentsService');

  /**
   * Constructor del servicio ProcedureDocumentsService.
   * Inyecta el repositorio de TypeORM.
   * @param procedureDocumentsRepository Repositorio para la entidad ProcedureDocument.
   */
  constructor(
    @InjectRepository(ProcedureDocument)
    private readonly procedureDocumentsRepository: Repository<ProcedureDocument>,
  ) {}

  /**
   * Busca y devuelve una lista de todos los Documentos de Trámite.
   * Filtra los documentos para incluir solo aquellos donde el campo 'shortened' no es nulo ni una cadena vacía.
   * Selecciona los campos 'id', 'name' y 'shortened'.
   * @returns Una promesa que resuelve con un array de objetos ProcedureDocument con campos 'id', 'name' y 'shortened'.
   */
  async findAll(columns: string[]): Promise<Partial<ProcedureDocument>[]> {
    if (columns && columns.length > 0) {
      return this.procedureDocumentsRepository.find({
        select: columns as (keyof ProcedureDocument)[],
        where: [{ shortened: Not(IsNull()) }, { shortened: Not('') }],
      });
    }
    return this.procedureDocumentsRepository.find({
      where: [{ shortened: Not(IsNull()) }, { shortened: Not('') }],
    });
  }

  /**
   * Busca y devuelve un Documento de Trámite específico por su ID.
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
        message: `Documento with: ${id} not found`,
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
    columns?: string[],
  ): Promise<Partial<ProcedureDocument>[]> {
    const selectColumns = columns?.length
      ? ([...columns] as (keyof ProcedureDocument)[])
      : undefined;

    const documents = await this.procedureDocumentsRepository.find({
      where: { id: In(ids) },
      select: selectColumns,
    });

    return documents;
  }
}
