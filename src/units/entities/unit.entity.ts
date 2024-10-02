import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Breakdown } from './breakdown.entity';

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
  created_at: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(() => Breakdown, (breakdown) => breakdown.units)
  @JoinColumn({ name: 'breakdown_id' })
  breakdown: Breakdown;
}
