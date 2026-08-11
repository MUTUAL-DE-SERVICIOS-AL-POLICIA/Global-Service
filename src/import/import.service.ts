import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessagePattern } from '@nestjs/microservices';
import { ImportConfig } from './entities/import-config.entity';
import { ImportRecord, ImportStatus } from './entities/import-record.entity';

@Injectable()
export class ImportService {
  private readonly logger = new Logger('ImportService');

  constructor(
    @InjectRepository(ImportConfig)
    private readonly configRepo: Repository<ImportConfig>,
    @InjectRepository(ImportRecord)
    private readonly recordRepo: Repository<ImportRecord>,
  ) {}

  @MessagePattern('global.initImport')
  async initImport(data: {
    name: string;
    ftpPath: string;
    originalFileName: string;
    fileHash?: string;
    uploadedBy: string;
  }) {
    const config = await this.configRepo.findOne({ where: { name: data.name, isActive: true } });
    if (!config) {
      throw new NotFoundException(
        `No existe configuración de importación para "${data.name}". ` +
        `Registre una en la tabla import_configs.`,
      );
    }

    if (data.fileHash) {
      const existing = await this.recordRepo.findOne({
        where: {
          target: data.name,
          fileHash: data.fileHash,
          status: ImportStatus.COMPLETED,
        },
      });
      if (existing) {
        throw new BadRequestException(
          `El archivo "${data.originalFileName}" ya fue importado correctamente el ${existing.createdAt?.toISOString().split('T')[0] || 'fecha desconocida'}.` +
          ' Si necesita reimportarlo, elimine el registro primero.',
        );
      }
    }

    const record = await this.recordRepo.save({
      target: data.name,
      ftpPath: data.ftpPath,
      originalFileName: data.originalFileName,
      fileHash: data.fileHash,
      uploadedBy: data.uploadedBy,
      status: ImportStatus.PENDING,
    });

    this.logger.log(`Importación iniciada: ${data.name}, recordId: ${record.id}`);

    return { config, record };
  }

  @MessagePattern('global.finalizeImport')
  async finalizeImport(data: {
    id: number;
    status: string;
    rowStart?: number;
    rowEnd?: number;
    totalRows?: number;
    errorMessage?: string;
  }) {
    await this.recordRepo.update(
      { id: data.id },
      {
        status: data.status as ImportStatus,
        rowStart: data.rowStart,
        rowEnd: data.rowEnd,
        totalRows: data.totalRows,
        errorMessage: data.errorMessage,
      },
    );
    this.logger.log(`Importación finalizada: recordId: ${data.id}, status: ${data.status}`);
    return { updated: true };
  }
}
