import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProcedureType } from './';

@Entity({ schema: 'public', name: 'modules', synchronize: false })
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column()
  description: string;

  @Column()
  name: string;

  @Column()
  shortened: string;

  @OneToMany(() => ProcedureType, (procedureType) => procedureType.module)
  procedureTypes: ProcedureType[];
}
