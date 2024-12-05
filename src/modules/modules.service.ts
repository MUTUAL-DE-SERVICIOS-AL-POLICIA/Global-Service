import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module, ProcedureModality, ProcedureType } from './entities';
import { RpcException } from '@nestjs/microservices';

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
    const module = await this.moduleRepository.findOne({
      where: { id },
    });
    if (!module)
      throw new RpcException({
        message: `Module with id ${id} not found`,
        code: 404,
      });

    return module;
  }

  async findAllProcedureTypes(): Promise<ProcedureType[]> {
    return this.procedureTypeRepository.find();
  }

  async findOneProcedureTypes(id: number): Promise<ProcedureType> {
    const module = await this.procedureTypeRepository.findOne({
      where: { id },
    });
    if (!module)
      throw new RpcException({
        message: `ProcedureType with id ${id} not found`,
        code: 404,
      });

    return module;
  }

  async findAllProcedureModalities(): Promise<ProcedureModality[]> {
    return this.procedureModalityRepository.find();
  }

  async findOneProcedureModalities(id: number): Promise<ProcedureModality> {
    const module = await this.procedureModalityRepository.findOne({
      where: { id },
    });
    if (!module) {
      throw new RpcException({
        message: `ProcedureModality with id ${id} not found`,
        code: 404,
      });
    }
    return module;
  }

  async findAndVerifyModuleWithRelations(
    id: number,
    relations: string[],
    entity: 'module' | 'procedureType' | 'procedureModality',
  ): Promise<any> {
    const response = await this[`${entity}Repository`].findOne({
      where: { id },
      relations: relations.length > 0 ? relations : [],
    });
    if (!response) {
      throw new RpcException({
        message: `${entity} with ID: ${id} not found`,
        code: 404,
      });
    }
    return response;
  }
}
