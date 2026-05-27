import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentLocationService } from './payment-location.service';
@Controller()
export class PaymentLocationController {
  constructor(private readonly paymentLocationService: PaymentLocationService) {}

  @MessagePattern('global.getPaymentLocations')
  async getPaymentLocations() {
    return this.paymentLocationService.getPaymentLocations();
  }

}
