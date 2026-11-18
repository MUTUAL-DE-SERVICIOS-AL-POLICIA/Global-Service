import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './entities/account.entity';
import { FinancialEntity } from '../financial-entities/entities/financial-entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, FinancialEntity])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
