import { Module } from '@nestjs/common';
import { KinshipsService } from './kinships.service';
import { KinshipsController } from './kinships.controller';
import { Kinship } from './entities/kinship.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [KinshipsController],
  providers: [KinshipsService],
  imports: [TypeOrmModule.forFeature([Kinship])],
})
export class KinshipsModule {}
