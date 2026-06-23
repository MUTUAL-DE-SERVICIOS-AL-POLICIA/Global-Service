import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

@Injectable()
export class AccountService {
  private readonly logger = new Logger('AccountService');

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async accounts(): Promise<{
    error: boolean;
    message: string;
    data: any[] | null;
  }> {
    try {
      const accounts = await this.accountRepository.find({
        select: [
          'id',
          'financialEntityId',
          'name',
          'state',
          'accountNumber',
          'ciNitTitular',
          'cta',
        ],
      });

      return {
        error: false,
        message: 'Cuentas obtenidas correctamente',
        data: accounts.map((account) => ({
          id: account.id,
          eif: account.financialEntityId,
          name: account.name,
          state: account.state,
          accountNumber: account.accountNumber,
          ciNitTitular: account.ciNitTitular,
          cta: account.cta,
        })),
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener las cuentas: ${error.message}`,
        error.stack,
      );
      return {
        error: true,
        message: 'Error al obtener las cuentas',
        data: null,
      };
    }
  }

}
