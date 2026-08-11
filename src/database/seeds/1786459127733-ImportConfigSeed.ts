import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ImportConfig } from '../../import/entities/import-config.entity';

/**
 * Seeder para la tabla import_configs.
 *
 * Cómo crear un nuevo seeder para otra tabla:
 * 1. Copia este archivo y renombra la clase (ej: SalesSeed1786459127734)
 * 2. Renombra el método `run` según convenga
 * 3. Importa la entidad destino (ej: `import { Sales } from '../../sales/entities/sales.entity'`)
 * 4. Usa `dataSource.getRepository(Entidad)` para obtener el repositorio
 * 5. Llama a `repo.save({ ... })` con los datos iniciales
 * 6. El timestamp del filename debe ser único (ej: 1786459127734)
 *
 * Ejemplo para crear seeders de config:
 *   const configRepo = dataSource.getRepository(ImportConfig);
 *   await configRepo.save({ name: 'my_import', microservice: 'sales', ... });
 *
 * Ejemplo para crear seeders de datos maestros:
 *   const entityRepo = dataSource.getRepository(Cities);
 *   await entityRepo.save([{ name: 'Madrid' }, { name: 'Barcelona' }]);
 */
export default class ImportConfigSeed1786459127733 implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const configRepo = dataSource.getRepository(ImportConfig);

    const configs = [
      {
        name: 'extractos_bancarios',
        microservice: 'collections',
        schema: 'collections',
        table: 'bank_statements',
        skipRows: 2,
        startColumn: 2,
        delimiter: ',',
        columnMappings: [
          { columnIndex: 2, fieldName: 'date' },
          { columnIndex: 5, fieldName: 'operationCode' },
          { columnIndex: 6, fieldName: 'documentNumber' },
          { columnIndex: 14, fieldName: 'state' },
        ],
      },
    ];

    for (const config of configs) {
      const exists = await configRepo.findOne({ where: { name: config.name } });
      if (!exists) {
        await configRepo.save(config);
        console.log(`[Seeder] Config "${config.name}" creada`);
      } else {
        await configRepo.update({ name: config.name }, config);
        console.log(`[Seeder] Config "${config.name}" actualizada`);
      }
    }
  }
}
