import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
  imports: [TypeOrmModule.forFeature([City])],
})
export class CitiesModule {}
