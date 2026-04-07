import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Module } from 'src/modules/entities';
import { APORTES_MODULE_SEED } from 'src/database/seed-data/aportes.seed-data';
import { buildSeederError } from 'src/database/seed-data/aportes.seed-utils';

export default class AportesModulesSeed implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const seederName = AportesModulesSeed.name;

    try {
      const repository = dataSource.getRepository(Module);

      const moduleByName = await repository.findOne({
        where: { name: APORTES_MODULE_SEED.name },
      });

      if (moduleByName) {
        return;
      }

      const moduleByTuple = await repository.findOne({
        where: {
          displayName: APORTES_MODULE_SEED.displayName,
          description: APORTES_MODULE_SEED.description,
          shortened: APORTES_MODULE_SEED.shortened,
        },
      });

      if (moduleByTuple) {
        return;
      }

      await repository.save(repository.create(APORTES_MODULE_SEED));
    } catch (error) {
      throw buildSeederError(seederName, error);
    }
  }
}
