import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { FinancialEntity } from '../financial-entities/entities/financial-entity.entity';

@Injectable()
export class AccountService {
  private readonly logger = new Logger('AccountService');

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(FinancialEntity)
    private readonly financialEntityRepository: Repository<FinancialEntity>,
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
        `Error al obtener las cuentas: ${error}`,
        error,
      );
      return {
        error: true,
        message: 'Error al obtener las cuentas',
        data: null,
      };
    }
  }

  async accountsAllData(): Promise<{
    error: boolean;
    message: string;
    data:
      | {
          id: number;
          name: string;
          state: string;
          accountNumber: string;
          ciNitTitular: string;
          cta: string;
          financialEntity: Pick<
            FinancialEntity,
            'id' | 'name' | 'code' | 'isActive' | 'eif'
          > | null;
        }[]
      | null;
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
      const financialEntityIds = [
        ...new Set(accounts.map((account) => account.financialEntityId)),
      ];

      const financialEntities = financialEntityIds.length
        ? await this.financialEntityRepository.find({
            select: ['id', 'name', 'code', 'isActive', 'eif'],
            where: { id: In(financialEntityIds) },
          })
        : [];

      const financialEntitiesById = new Map(
        financialEntities.map((financialEntity) => [
          financialEntity.id,
          financialEntity,
        ]),
      );

      return {
        error: false,
        message: 'Cuentas obtenidas correctamente',
        data: accounts.map((account) => {
          const financialEntity =
            financialEntitiesById.get(account.financialEntityId) ?? null;

          return {
            id: account.id,
            name: account.name,
            state: account.state,
            accountNumber: account.accountNumber,
            ciNitTitular: account.ciNitTitular,
            cta: account.cta,
            financialEntity,
          };
        }),
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener todas las cuentas: ${error}`,
        error,
      );
      return {
        error: true,
        message: 'Error al obtener todas las cuentas',
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
            this.logger.error(`Error en findAllAccountsByIds con IDs ${ids}: ${error}`);
            throw error;
        }
    }
}
