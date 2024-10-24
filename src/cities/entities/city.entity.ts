import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'cities', synchronize: false })
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  firstShortened: string;

  @Column()
  secondShortened: string;

  @Column()
  thirdShortened: string;

  @Column()
  toBank?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  latitude?: number;

  @Column()
  longitude?: number;

  @Column()
  companyAddress: string;

  @Column()
  phonePrefix: number;

  @Column('json')
  companyPhones: any;

  @Column('json')
  companyCellphones: any;
}
