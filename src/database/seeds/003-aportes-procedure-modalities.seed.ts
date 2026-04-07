import { DataSource, In, Repository } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { ProcedureModality, ProcedureType } from 'src/modules/entities';
import {
  APORTES_PROCEDURE_TYPES,
  SeedProcedureTypeDefinition,
} from 'src/database/seed-data/aportes.seed-data';
import {
  buildSeederError,
  findByExactName,
} from 'src/database/seed-data/aportes.seed-utils';

export default class AportesProcedureModalitiesSeed implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const seederName = AportesProcedureModalitiesSeed.name;

    try {
      const procedureTypeRepository = dataSource.getRepository(ProcedureType);
      const procedureModalityRepository =
        dataSource.getRepository(ProcedureModality);

      const procedureTypeNames = APORTES_PROCEDURE_TYPES.map(
        (procedureType) => procedureType.name,
      );

      const procedureTypes = await procedureTypeRepository.find({
        where: procedureTypeNames.map((name) => ({ name })),
        withDeleted: true,
      });

      const procedureTypeIds = procedureTypes.map((procedureType) => procedureType.id);
      const existingProcedureModalities =
        procedureTypeIds.length > 0
          ? await procedureModalityRepository.find({
              relations: ['procedureType'],
              where: {
                procedureType: {
                  id: In(procedureTypeIds),
                },
              },
            })
          : [];

      for (const procedureTypeSeed of APORTES_PROCEDURE_TYPES) {
        const procedureType = findByExactName(
          procedureTypes,
          procedureTypeSeed.name,
        );

        if (!procedureType) {
          throw new Error(
            `No se encontró procedure_type para "${procedureTypeSeed.name}".`,
          );
        }

        await this.seedModalitiesForType(
          procedureModalityRepository,
          existingProcedureModalities,
          procedureType,
          procedureTypeSeed,
        );
      }
    } catch (error) {
      throw buildSeederError(seederName, error);
    }
  }

  private async seedModalitiesForType(
    procedureModalityRepository: Repository<ProcedureModality>,
    existingProcedureModalities: ProcedureModality[],
    procedureType: ProcedureType,
    procedureTypeSeed: SeedProcedureTypeDefinition,
  ): Promise<void> {
    for (const modalitySeed of procedureTypeSeed.modalities) {
      const existingProcedureModality = existingProcedureModalities.find(
        (procedureModality) =>
          procedureModality.procedureType?.id === procedureType.id &&
          findByExactName([procedureModality], modalitySeed.name),
      );

      if (existingProcedureModality) {
        continue;
      }

      const createdProcedureModality = procedureModalityRepository.create({
        isValid: true,
        name: modalitySeed.name,
        procedureType,
        shortened: modalitySeed.shortened,
      });

      const savedProcedureModality =
        await procedureModalityRepository.save(createdProcedureModality);

      existingProcedureModalities.push(savedProcedureModality);
    }
  }
}
