import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module, ProcedureModality, ProcedureType } from './entities';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
    @InjectRepository(ProcedureType)
    private readonly procedureTypeRepository: Repository<ProcedureType>,
    @InjectRepository(ProcedureModality)
    private readonly procedureModalityRepository: Repository<ProcedureModality>,
  ) {}

  async findAllModules(): Promise<Module[]> {
    return this.moduleRepository.find();
  }

  async findOneModules(id: number): Promise<Module> {
    const module = this.moduleRepository.findOne({
      where: { id },
    });
    if (!module) throw new NotFoundException(`Module with id ${id} not found`);

    return module;
  }

  async findAllProcedureTypes(): Promise<ProcedureType[]> {
    return this.procedureTypeRepository.find();
  }

  async findOneProcedureTypes(id: number): Promise<ProcedureType> {
    const module = this.procedureTypeRepository.findOne({
      where: { id },
    });
    if (!module)
      throw new NotFoundException(`ProcedureType with id ${id} not found`);

    return module;
  }

  async findAllProcedureModalities(): Promise<ProcedureModality[]> {
    return this.procedureModalityRepository.find();
  }

  async findOneProcedureModalities(id: number): Promise<ProcedureModality> {
    const module = this.procedureModalityRepository.findOne({
      where: { id },
    });
    if (!module)
      throw new NotFoundException(`ProcedureModality with id ${id} not found`);

    return module;
  }

  async findDataRelations(
    id: number,
    entity: 'module' | 'procedureType' | 'procedureModality',
    relations: string,
  ): Promise<any> {
    const data = await this.findAndVerifyModuleWithRelations(
      id,
      [relations],
      entity
    );
    return data;
  }

  private async findAndVerifyModuleWithRelations(
    id: number,
    relations: string[],
    entity: 'module' | 'procedureType' | 'procedureModality',
  ): Promise<any> {
    const response = await this[`${entity}Repository`].findOne({
      where: { id},
      relations: relations.length > 0 ? relations : [],
    });
    if (!response) {
      throw new NotFoundException(`${entity} with ID: ${id} not found`);
    }
    return response;
  }
}
