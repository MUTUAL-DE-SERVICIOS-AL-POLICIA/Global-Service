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
    
    async getAccounts(): Promise<{
        error: boolean;
        message: string;
        data: Pick<Account, 'id' | 'eif' | 'name' | 'accountNumber' >[] | null;
    }> {
        try {
            const accounts = await this.accountRepository.find({
                select: ['id', 'eif', 'name', 'accountNumber'],
            });
            return {
                error: false,
                message: 'Cuentas obtenidas correctamente',
                data: accounts,
            };
        } catch (error) {
            this.logger.error(`Error al obtener las cuentas: ${error.message}`, error.stack);
            return {
                error: true,
                message: 'Error al obtener las cuentas',
                data: null,
            };
        }
    }

    async findAllAccountsByIds(
        ids: number[],
        columns?: string[],
    ): Promise<any[]> {
        try {
            if (!ids || ids.length === 0) {
                return [];
            }

            const hasShortened = columns?.includes('shortened');

            // Mapeamos 'shortened' a 'accountNumber' para la consulta DB ya que no es una columna real
            const dbColumns = columns?.map(col => col === 'shortened' ? 'accountNumber' : col) as (keyof Account)[];

            const accounts = await this.accountRepository.find({
                where: { id: In(ids) },
                select: dbColumns,
            });

            if (hasShortened) {
                return accounts.map(acc => {
                    const res: any = { ...acc };
                    // Map to 'shortened'
                    res.shortened = acc.accountNumber;
                    return res;
                });
            }

            return accounts;
        } catch (error) {
            this.logger.error(`Error en findAllAccountsByIds con IDs ${ids}: ${error.message}`, error.stack);
            throw error;
        }
    }

}
