import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProcedureDocument } from './entities/procedure-document.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProcedureDocumentsService {
  private readonly logger = new Logger('ProcedureDocumentsService');
  constructor(
    @InjectRepository(ProcedureDocument)
    private readonly procedureDocumentsRepository: Repository<ProcedureDocument>,
  ) {}
  async findAll(): Promise<Partial<ProcedureDocument>[]> {
    return this.procedureDocumentsRepository.find({
      select: ['name', 'updatedAt'],
    });
  }

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

  async findAllByIds(
    ids: number[],
  ): Promise<Record<number, { name: string; shortened: string }>> {
    const documents = await this.procedureDocumentsRepository.findBy({
      id: In(ids),
    });

    const result = documents.reduce(
      (acc: Record<number, { name: string; shortened: string }>, doc) => {
        acc[doc.id] = {
          name: doc.name,
          shortened: doc.shortened || '',
        };
        return acc;
      },
      {},
    );

    return result;
  }
}
