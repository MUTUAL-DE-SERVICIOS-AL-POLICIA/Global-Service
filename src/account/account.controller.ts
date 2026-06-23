import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccountService } from './account.service';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern('global.accounts')
  async accounts() {
    return this.accountService.accounts();
  }

  // mostrar todas las cuentas con todos sus datos, incluyendo el contenido financialEntityId
  @MessagePattern('global.accountsAllData')
  async accountsAllData() {
    return this.accountService.accountsAllData();
  }
}
