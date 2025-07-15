import { Module } from '@nestjs/common';
import { FileDossiersService } from './file-dossiers.service';
import { FileDossiersController } from './file-dossiers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileDossier } from './entities/file-dossier.entity';

@Module({
  controllers: [FileDossiersController],
  providers: [FileDossiersService],
  imports: [TypeOrmModule.forFeature([FileDossier])],
})
export class FileDossiersModule {}
