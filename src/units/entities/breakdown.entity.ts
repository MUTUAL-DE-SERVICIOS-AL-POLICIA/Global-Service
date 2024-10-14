import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Unit } from './';

@Entity({ schema: 'public', name: 'breakdowns', synchronize: false })
export class Breakdown {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: number;

  @Column()
  name: string;

  @OneToMany(() => Unit, (units) => units.breakdown)
  units: Unit[];
}
