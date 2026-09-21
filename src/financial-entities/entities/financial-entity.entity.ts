import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'financial_entities', synchronize: false })
export class FinancialEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: true })
  code: string | null;

  @Column({ type: 'boolean', nullable: true, name: 'is_active' })
  isActive: boolean | null;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: true,
    name: 'eif',
  })
  eif: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
