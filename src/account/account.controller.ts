import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccountService } from './account.service';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern('accounts.findAll')
  async accounts() {
    return this.accountService.accounts();
  }

  // mostrar todas las cuentas con todos sus datos, incluyendo el contenido financialEntityId
  @MessagePattern('accounts.findAllData')
  async accountsAllData() {
    return this.accountService.accountsAllData();
  }

  @MessagePattern('accounts.findAllByIds')
  async findAllAccountsByIds(data: { ids: number[]; columns?: string[] }) {
    return this.accountService.findAllAccountsByIds(data.ids, data.columns);
  }
  
}
