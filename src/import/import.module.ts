import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportConfig } from './entities/import-config.entity';
import { ImportRecord } from './entities/import-record.entity';
import { ImportService } from './import.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImportConfig, ImportRecord])],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
