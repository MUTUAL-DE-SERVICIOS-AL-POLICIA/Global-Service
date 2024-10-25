import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProcedureModality } from './';
import { ProcedureDocument } from 'src/procedure-documents/entities/procedure-document.entity';
@Entity({
  schema: 'public',
  name: 'procedure_requirements',
  synchronize: false,
})
export class ProcedureRequirement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ProcedureModality,
    (procedureModality) => procedureModality.procedureRequirements,
  )
  procedureModality: ProcedureModality;

  @ManyToOne(
    () => ProcedureDocument,
    (procedureDocument) => procedureDocument.procedureRequirements,
  )
  procedureDocument: ProcedureDocument;

  @Column()
  number: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
