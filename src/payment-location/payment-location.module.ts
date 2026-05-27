import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentLocationService } from './payment-location.service';
import { PaymentLocationController } from './payment-location.controller';
import { PaymentLocation } from './entities/payment-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentLocation])],
  controllers: [PaymentLocationController],
  providers: [PaymentLocationService],
})
export class PaymentLocationModule {}
