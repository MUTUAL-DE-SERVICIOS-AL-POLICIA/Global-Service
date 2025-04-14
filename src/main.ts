import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NastEnvs } from './config';

import {
  RpcCustomExceptionFilter,
  BadRequestCustomExceptionFilter,
} from './common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: NastEnvs.natsServers,
      },
    },
  );

  app.useGlobalFilters(
    new RpcCustomExceptionFilter(),
    new BadRequestCustomExceptionFilter(),
  );

  await app.listen();
}
bootstrap();
