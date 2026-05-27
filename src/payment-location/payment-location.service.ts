import { Injectable } from '@nestjs/common';
import { PaymentLocation } from './entities/payment-location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentLocationService {

  constructor(
    @InjectRepository(PaymentLocation)
    private readonly paymentLocationRepository: Repository<PaymentLocation>,
  ) {}

  async getPaymentLocations(): Promise<Pick<PaymentLocation, 'id' | 'name' | 'code' >[]> {
    return this.paymentLocationRepository.find({
      select: ['id', 'name', 'code'],
      where: { isActive: true },
    });
  }

}
