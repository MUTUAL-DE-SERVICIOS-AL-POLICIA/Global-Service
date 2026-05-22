import { AccountState } from '../entities/account.entity';

export class CreateAccountDto {
  eif: string;
  name: string;
  state?: AccountState;
  accountNumber: string;
}
