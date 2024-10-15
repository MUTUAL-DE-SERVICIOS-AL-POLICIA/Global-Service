import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'cities', synchronize: false })
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  first_shortened: string;

  @Column()
  second_shortened: string;

  @Column()
  third_shortened: string;

  @Column()
  to_bank?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  latitude?: number;

  @Column()
  longitude?: number;

  @Column()
  company_address: string;

  @Column()
  phone_prefix: number;

  @Column('json')
  company_phones: any;

  @Column('json')
  company_cellphones: any;
}
