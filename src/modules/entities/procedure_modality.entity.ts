import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProcedureType } from './';

@Entity({ schema: 'public', name: 'procedure_modalities', synchronize: false })
export class ProcedureModality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  shortened: string;
  
  @Column()
  isValid: boolean;

  @ManyToOne(() => ProcedureType, (procedureType) => procedureType.procedureModalities)
  procedureType: ProcedureType;
}
