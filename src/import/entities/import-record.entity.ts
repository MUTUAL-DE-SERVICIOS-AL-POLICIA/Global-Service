import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ImportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity({ schema: 'global', name: 'import_records' })
export class ImportRecord {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100 })
  target: string;

  @Column({ name: 'ftp_path', length: 500 })
  ftpPath: string;

  @Column({ name: 'original_file_name', length: 255 })
  originalFileName: string;

  @Column({ name: 'file_hash', length: 64, nullable: true })
  fileHash: string;

  @Column({ name: 'uploaded_by', length: 100 })
  uploadedBy: string;

  @Column({ name: 'row_start', default: 0 })
  rowStart: number;

  @Column({ name: 'row_end', default: 0 })
  rowEnd: number;

  @Column({ name: 'total_rows', default: 0 })
  totalRows: number;

  @Column({ name: 'processed_rows', default: 0 })
  processedRows: number;

  @Column({ length: 20, default: 'PENDING' })
  status: ImportStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
