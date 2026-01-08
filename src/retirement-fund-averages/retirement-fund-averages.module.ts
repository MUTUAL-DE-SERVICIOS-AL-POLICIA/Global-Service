import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetirementFundAveragesService } from './retirement-fund-averages.service';
import { RetirementFundAveragesController } from './retirement-fund-averages.controller';
import { RetirementFundAverage } from './entities/retirement-fund-average.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RetirementFundAverage])],
  controllers: [RetirementFundAveragesController],
  providers: [RetirementFundAveragesService],
  exports: [RetirementFundAveragesService],
})
export class RetirementFundAveragesModule {}