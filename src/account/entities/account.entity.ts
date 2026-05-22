import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AccountState {
  ACTIVE = 'activo',
  INACTIVE = 'inactivo',
  BLOCKED = 'bloqueado',
}

@Entity({ schema: 'global', name: 'accounts', synchronize: false })
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  eif: string;

  @Column({ length: 150 })
  name: string;

  @Column({
    type: 'enum',
    enum: AccountState,
    default: AccountState.ACTIVE,
  })
  state: AccountState;

  @Column({ name: 'account_number', length: 50, unique: true })
  accountNumber: string;
}
