import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProcedureDocument } from './entities/procedure-document.entity';

@Injectable()
export class ProcedureDocumentsService {
  private readonly logger = new Logger('ProcedureDocumentsService');
  constructor(
    @InjectRepository(ProcedureDocument)
    private readonly procedureDocumentsRepository: Repository<ProcedureDocument>,
  ) {}
  async findAll(): Promise<Partial<ProcedureDocument>[]> {
    return this.procedureDocumentsRepository.find({
      select: ['name', 'updated_at'],
    });
  }

  async findOne(id: number): Promise<ProcedureDocument> {
    const procedureDocument = await this.procedureDocumentsRepository.findOneBy(
      { id },
    );

    if (!procedureDocument)
      throw new NotFoundException(`Documento with: ${id} not found`);

    return procedureDocument;
  }

  async findAllByIds(ids: number[]): Promise<Record<number, string>> {
    const documents = await this.procedureDocumentsRepository.findBy({
      id: In(ids),
    });

    const result = documents.reduce((acc: Record<number, string>, doc) => {
      acc[doc.id] = doc.name;
      return acc;
    }, {});

    return result;
  }
}
