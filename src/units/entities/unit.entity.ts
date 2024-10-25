import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Breakdown } from './';

@Entity({ schema: 'public', name: 'units', synchronize: false })
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  district: string;

  @Column()
  code: number;

  @Column()
  name: string;

  @Column()
  shortened: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => Breakdown, (breakdown) => breakdown.units)
  breakdown: Breakdown;
}
