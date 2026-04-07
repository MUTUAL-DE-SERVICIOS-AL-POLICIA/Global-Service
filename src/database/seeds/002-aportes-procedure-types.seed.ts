import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Module, ProcedureType } from 'src/modules/entities';
import {
  APORTES_MODULE_SEED,
  APORTES_PROCEDURE_TYPES,
} from 'src/database/seed-data/aportes.seed-data';
import {
  buildSeederError,
  findByExactName,
} from 'src/database/seed-data/aportes.seed-utils';

export default class AportesProcedureTypesSeed implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const seederName = AportesProcedureTypesSeed.name;

    try {
      const moduleRepository = dataSource.getRepository(Module);
      const procedureTypeRepository = dataSource.getRepository(ProcedureType);

      const moduleEntity = await moduleRepository.findOne({
        where: { name: APORTES_MODULE_SEED.name },
      });

      if (!moduleEntity) {
        throw new Error(
          'No se encontró el módulo "contribuciones" para sembrar procedure_types.',
        );
      }

      const existingProcedureTypes = await procedureTypeRepository.find({
        relations: ['module'],
        where: { module: { id: moduleEntity.id } },
        withDeleted: true,
      });

      for (const procedureTypeSeed of APORTES_PROCEDURE_TYPES) {
        const existingProcedureType = findByExactName(
          existingProcedureTypes,
          procedureTypeSeed.name,
        );

        if (existingProcedureType) {
          continue;
        }

        const createdProcedureType = procedureTypeRepository.create({
          module: moduleEntity,
          name: procedureTypeSeed.name,
          secondName: procedureTypeSeed.secondName,
        });

        await procedureTypeRepository.save(createdProcedureType);
      }
    } catch (error) {
      throw buildSeederError(seederName, error);
    }
  }
}
