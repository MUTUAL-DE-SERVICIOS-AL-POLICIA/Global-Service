import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm'; // Importaciones de TypeORM usadas en queries
import { FileDossier } from './entities/file-dossier.entity';
import { RpcException } from '@nestjs/microservices';

/**
 * Servicio encargado de la lógica de negocio relacionada con los Expedientes de Trámite(FileDossiers).
 */
@Injectable()
export class FileDossiersService {
  /**
   * Instancia del Logger para registrar información o errores específicos de este servicio.
   */
  private readonly logger = new Logger('FileDossiersService');

  /**
   * Constructor del servicio FileDossiersService.
   * Inyecta el repositorio de TypeORM.
   * @param fileDossiersRepository Repositorio para la entidad FileDossiers.
   */
  constructor(
    @InjectRepository(FileDossier)
    private readonly fileDossiersRepository: Repository<FileDossier>,
  ) {}

  /**
   * Busca y devuelve una lista de todos los Expedientes de Trámite.
   * Filtra los documentos para incluir solo aquellos donde el campo 'shortened' no es nulo ni una cadena vacía.
   * Selecciona los campos 'id', 'name' y 'shortened'.
   * @returns Una promesa que resuelve con un array de objetos FileDossiers con campos 'id', 'name' y 'shortened'.
   */
  async findAll(columns: string[]): Promise<Partial<FileDossier>[]> {
    if (columns && columns.length > 0) {
      return this.fileDossiersRepository.find({
        select: columns as (keyof FileDossier)[],
      });
    }
    return this.fileDossiersRepository.find();
  }

  /**
   * Busca y devuelve un Expediente de Trámite específico por su ID.
   * @param id El ID numérico del Expediente de Trámite a buscar.
   * @returns Una promesa que resuelve con el objeto FileDossiers completo si es encontrado.
   * @throws RpcException Si no se encuentra un Expediente de Trámite con el ID proporcionado (código 404).
   */
  async findOne(id: number): Promise<FileDossier> {
    const fileDossiers = await this.fileDossiersRepository.findOneBy({ id });

    if (!fileDossiers)
      throw new RpcException({
        message: `Expediente with: ${id} not found`,
        code: 404,
      });

    return fileDossiers;
  }

  /**
   * Busca Expedientes de Trámite por una lista de IDs y devuelve un mapa con la información seleccionada.
   * El mapa resultante tiene los IDs de los documentos como claves y objetos con 'name' y 'shortened' como valores.
   * @param ids Un array de números representando los IDs de los documentos a buscar.
   * @returns Una promesa que resuelve con un objeto (mapa) donde las claves son los IDs de los documentos encontrados
   * y los valores son objetos `{ name: string; shortened: string }`. Si no se encuentran documentos para los IDs proporcionados, el mapa estará vacío o contendrá solo los encontrados.
   */
  async findAllByIds(
    ids: number[],
    columns?: string[],
  ): Promise<Partial<FileDossier>[]> {
    const selectColumns = columns?.length
      ? ([...columns] as (keyof FileDossier)[])
      : undefined;

    const fileDossiers = await this.fileDossiersRepository.find({
      where: { id: In(ids) },
      select: selectColumns,
    });

    return fileDossiers;
  }
}
