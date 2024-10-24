import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity , ProcedureModality, ProcedureRequirement, ProcedureType } from './entities';

@Module({
  controllers: [ModulesController],
  providers: [ModulesService],
  imports: [TypeOrmModule.forFeature([ModuleEntity, ProcedureModality, ProcedureRequirement, ProcedureType])],
})
export class ModulesModule {}
