import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProcedureDocumentsModule } from './procedure-documents/procedure-documents.module';
import { BreakdownsModule } from './breakdowns-unit/breakdowns-units.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProcedureDocumentsModule,
    BreakdownsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
