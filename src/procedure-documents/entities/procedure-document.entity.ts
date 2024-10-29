import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProcedureRequirement } from 'src/modules/entities';
@Entity({ schema: 'public', name: 'procedure_documents', synchronize: false })
export class ProcedureDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  shortened: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  expireDate: Date;

  @OneToMany(
    () => ProcedureRequirement,
    (procedureRequirement) => procedureRequirement.procedureDocument,
  )
  procedureRequirements: ProcedureRequirement[];
}
