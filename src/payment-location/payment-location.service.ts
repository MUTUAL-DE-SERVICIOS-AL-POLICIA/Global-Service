import { Injectable, Logger } from '@nestjs/common';
import { PaymentLocation } from './entities/payment-location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentLocationService {
  private readonly logger = new Logger('PaymentLocationService');

  constructor(
    @InjectRepository(PaymentLocation)
    private readonly paymentLocationRepository: Repository<PaymentLocation>,
  ) {}

  async paymentLocations(): Promise<{
    error: boolean;
    message: string;
    data: Pick<PaymentLocation, 'id' | 'name' | 'code'>[] | null;
  }> {
    try {
      const paymentLocations = await this.paymentLocationRepository.find({
        select: ['id', 'name', 'code'],
        where: { isActive: true },
      });

      return {
        error: false,
        message: 'Ubicaciones de pago obtenidas correctamente',
        data: paymentLocations,
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener las ubicaciones de pago: ${error.message}`,
        error.stack,
      );
      return {
        error: true,
        message: 'Error al obtener las ubicaciones de pago',
        data: null,
      };
    }
  }
}
