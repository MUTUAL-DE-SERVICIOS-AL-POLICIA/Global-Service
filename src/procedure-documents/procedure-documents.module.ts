import { Module } from '@nestjs/common';
import { ProcedureDocumentsService } from './procedure-documents.service';
import { ProcedureDocumentsController } from './procedure-documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcedureDocument } from './entities/procedure-document.entity';

@Module({
  controllers: [ProcedureDocumentsController],
  providers: [ProcedureDocumentsService],
  imports: [TypeOrmModule.forFeature([ProcedureDocument])],
})
export class ProcedureDocumentsModule {}
