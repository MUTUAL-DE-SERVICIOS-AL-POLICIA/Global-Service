import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ImportConfig } from '../../import/entities/import-config.entity';

export default class ImportConfigSeed1717400000000 implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(ImportConfig);

    await repo.save({
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
    });
  }
}
