import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { APORTES_REQUIREMENT_PLACEHOLDERS } from 'src/database/seed-data/aportes.seed-data';
import { buildSeederError } from 'src/database/seed-data/aportes.seed-utils';

export default class AportesProcedureRequirementsSeed implements Seeder {
  track = false;

  public async run(
    _dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const seederName = AportesProcedureRequirementsSeed.name;

    try {
      // Placeholder: las relaciones de procedure_requirements se completarán
      // en la siguiente edición. Por ahora no se inserta ninguna fila.
      // Se deja esta estructura pendiente para evitar que se pierda el trabajo
      // realizado por mi dgbautista.
      const pendingRequirementStructure = APORTES_REQUIREMENT_PLACEHOLDERS;
      void pendingRequirementStructure;
    } catch (error) {
      throw buildSeederError(seederName, error);
    }
  }
}
