import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { ProcedureDocument } from 'src/procedure-documents/entities/procedure-document.entity';
import {
  APORTES_DOCUMENTS,
  SeedDocumentDefinition,
} from 'src/database/seed-data/aportes.seed-data';
import {
  buildSeederError,
  findByExactName,
} from 'src/database/seed-data/aportes.seed-utils';

export default class AportesProcedureDocumentsSeed implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const seederName = AportesProcedureDocumentsSeed.name;

    try {
      const repository = dataSource.getRepository(ProcedureDocument);
      const existingDocuments = await repository.find();

      for (const documentSeed of Object.values(
        APORTES_DOCUMENTS,
      ) as SeedDocumentDefinition[]) {
        const existingDocument = findByExactName(
          existingDocuments,
          documentSeed.name,
        );

        if (existingDocument) {
          continue;
        }

        const existingByShortened = existingDocuments.find(
          (document) => document.shortened === documentSeed.shortened,
        );

        if (existingByShortened) {
          throw new Error(
            `Ya existe un procedure_document con shortened "${documentSeed.shortened}" y nombre "${existingByShortened.name}".`,
          );
        }

        const createdDocument = repository.create({
          createdAt: new Date(),
          expireDate: null,
          name: documentSeed.name,
          shortened: documentSeed.shortened,
          updatedAt: new Date(),
        });

        const savedDocument = await repository.save(createdDocument);
        existingDocuments.push(savedDocument);
      }
    } catch (error) {
      throw buildSeederError(seederName, error);
    }
  }
}
