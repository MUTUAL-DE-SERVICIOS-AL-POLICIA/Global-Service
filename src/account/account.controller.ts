import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountService } from './account.service';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern('global.accounts')
  async accounts() {
    return this.accountService.accounts();
  }

  @MessagePattern('global.findAllAccountsByIds')
  async findAllAccountsByIds(data: { ids: number[]; columns?: string[] }) {
    return this.accountService.findAllAccountsByIds(data.ids, data.columns);
  }
  
}
