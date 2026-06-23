import { MigrationInterface, QueryRunner, Table } from 'typeorm';

function getSchema(queryRunner: QueryRunner): string {
  const options = queryRunner.connection.options as { schema?: string };
  return options.schema ?? 'global';
}

export class AddTableAccountsAndFinancialEntities1779696000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        schema: getSchema(queryRunner),
        name: 'financial_entities',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '10',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'eif',
            type: 'varchar',
            length: '20',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.query(`
      INSERT INTO ${getSchema(queryRunner)}.financial_entities (id, name, code, is_active, eif)
      VALUES
        (1, 'MUTUAL DE SERVICIOS AL POLICÍA', 'MUS', true, null),
        (2, 'BANCO BISA S.A.', 'BIS', true, null),
        (3, 'BANCO DE CRÉDITO DE BOLIVIA S.A.', 'BCR', true, null),
        (4, 'BANCO PYME ECOFUTURO S.A.', 'PEF', true, null),
        (5, 'BANCO ECONOMICO S.A.', 'BEC', true, null),
        (6, 'BANCO FIE (BANCO PARA EL FOMENTO A INICIATIVAS ECONÓMICAS S.A.)', 'BIE', true, null),
        (7, 'BANCO FORTALEZA S.A.', 'BFO', true, null),
        (8, 'BANCO GANADERO S.A.', 'BGA', true, null),
        (9, 'BANCO MERCANTIL SANTA CRUZ S.A.', 'BME', true, null),
        (10, 'BANCO DE LA NACIÓN ARGENTINA', 'BNA', true, null),
        (11, 'BANCO NACIONAL DE BOLIVIA S.A.', 'BNB', true, null),
        (12, 'BANCO SOLIDARIO S.A.', 'BSO', true, null),
        (13, 'BANCO PRODEM S.A.', 'BPR', true, null),
        (14, 'BANCO UNIÓN S.A.', 'BUN', true, 'MLD1014'),
        (15, 'BANCO FASSIL S.A.', 'FAS', false, null)
    `);

    await queryRunner.query(`
      SELECT setval(
        pg_get_serial_sequence('${getSchema(queryRunner)}.financial_entities', 'id'),
        (SELECT MAX(id) FROM ${getSchema(queryRunner)}.financial_entities)
      )
    `);

    await queryRunner.createTable(
      new Table({
        schema: getSchema(queryRunner),
        name: 'accounts',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'financial_entity_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '120',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'account_number',
            type: 'varchar',
            length: '30',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'ci_nit_titular',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'cta',
            type: 'varchar',
            length: '30',
            default: "'0'",
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(`${getSchema(queryRunner)}.accounts`);
    await queryRunner.dropTable(`${getSchema(queryRunner)}.financial_entities`);
  }
}
