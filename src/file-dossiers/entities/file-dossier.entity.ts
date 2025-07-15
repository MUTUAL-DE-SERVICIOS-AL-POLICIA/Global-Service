import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'file_dossiers', synchronize: false })
export class FileDossier {
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
  deletedAt: Date;
}
