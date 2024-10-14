import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Degree } from './';

@Entity({ schema: 'public', name: 'hierarchies', synchronize: false })
export class Hierarchy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @OneToMany(() => Degree, (degrees) => degrees.hierarchy)
  degrees: Degree[];
}
