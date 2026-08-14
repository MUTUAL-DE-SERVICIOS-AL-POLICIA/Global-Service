import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface ColumnMapping {
  columnIndex: number;
  fieldName: string;
}

@Entity({ schema: 'global', name: 'import_configs' })
export class ImportConfig {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ length: 50 })
  microservice: string;

  @Column({ length: 50 })
  schema: string;

  @Column({ length: 50 })
  table: string;

  @Column({ name: 'skip_rows', default: 0 })
  skipRows: number;

  @Column({ name: 'start_column', default: 1 })
  startColumn: number;

  @Column({ type: 'jsonb', nullable: true })
  columnMappings: ColumnMapping[];

  @Column({ length: 10, default: ',' })
  delimiter: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
