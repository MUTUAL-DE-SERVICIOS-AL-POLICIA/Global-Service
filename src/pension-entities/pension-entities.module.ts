import { Module } from '@nestjs/common';
import { PensionEntitiesService } from './pension-entities.service';
import { PensionEntitiesController } from './pension-entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PensionEntity } from './entities/pension-entity.entity';

@Module({
  controllers: [PensionEntitiesController],
  providers: [PensionEntitiesService],
  imports: [TypeOrmModule.forFeature([PensionEntity])],
})
export class PensionEntitiesModule {}
