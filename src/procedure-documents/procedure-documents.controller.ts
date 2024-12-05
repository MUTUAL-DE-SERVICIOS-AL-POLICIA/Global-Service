import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProcedureDocumentsService } from './procedure-documents.service';

@Controller()
export class ProcedureDocumentsController {
  constructor(
    private readonly procedureDocumentsService: ProcedureDocumentsService,
  ) {}

  @MessagePattern('procedureDocuments.findAll')
  findAll() {
    return this.procedureDocumentsService.findAll();
  }

  @MessagePattern('procedureDocuments.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.procedureDocumentsService.findOne(id);
  }

  @MessagePattern('procedureDocuments.findAllByIds')
  async findAllByIds(data: {
    ids: number[];
  }): Promise<Record<number, { name: string; shortened: string }>> {
    return this.procedureDocumentsService.findAllByIds(data.ids);
  }
}
