import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'categories', synchronize: false })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: number;

  @Column()
  to: number;

  @Column()
  name: string;

  @Column({ precision: 13, scale: 2 })
  percentage: number;
}
