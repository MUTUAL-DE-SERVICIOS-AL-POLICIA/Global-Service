import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ModulesService } from './modules.service';

@Controller()
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @MessagePattern('modules.findAll')
  findAllModules() {
    return this.modulesService.findAllModules();
  }

  @MessagePattern('modules.findOne')
  findOneModules(@Payload('id', ParseIntPipe) id: number) {
    return this.modulesService.findOneModules(id);
  }

  @MessagePattern('procedureTypes.findAll')
  findAllProcedureTypes() {
    return this.modulesService.findAllProcedureTypes();
  }

  @MessagePattern('procedureTypes.findOne')
  findOneProcedureTypes(@Payload('id', ParseIntPipe) id: number) {
    return this.modulesService.findOneProcedureTypes(id);
  }

  @MessagePattern('procedureModalities.findAll')
  findAllProcedureModalities() {
    return this.modulesService.findAllProcedureModalities();
  }

  @MessagePattern('procedureModalities.findOne')
  findOneProcedureModalities(@Payload('id', ParseIntPipe) id: number) {
    return this.modulesService.findOneProcedureModalities(id);
  }

  @MessagePattern('modules.findDataRelations')
  findDataRelations(
    @Payload('id', ParseIntPipe) id: number,
    @Payload('relations') relations: [],
    @Payload('entity') entity: 'module' | 'procedureType' | 'procedureModality',
  ) {
    return this.modulesService.findAndVerifyModuleWithRelations(
      id,
      relations,
      entity,
    );
  }
}
