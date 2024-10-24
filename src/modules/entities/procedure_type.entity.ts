import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Module, ProcedureModality } from './';

@Entity({ schema: 'public', name: 'procedure_types', synchronize: false })
export class ProcedureType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  secondName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Module, (module) => module.procedureTypes)
  module: Module;

  @OneToMany(() => ProcedureModality, (procedureModality) => procedureModality.procedureType)
  procedureModalities: ProcedureModality[];
}
