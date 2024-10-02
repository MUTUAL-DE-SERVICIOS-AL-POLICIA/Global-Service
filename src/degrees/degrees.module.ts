import { Module } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { DegreesController } from './degrees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Degree, Hierarchy } from './entities';

@Module({
  controllers: [DegreesController],
  providers: [DegreesService],
  imports: [TypeOrmModule.forFeature([Degree, Hierarchy])],
})
export class DegreesModule {}
