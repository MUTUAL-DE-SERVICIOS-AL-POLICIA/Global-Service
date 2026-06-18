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
        name: 'accounts',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'eif',
            type: 'varchar',
            length: '20',
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
      INSERT INTO ${getSchema(queryRunner)}.accounts (id, eif, name, state, account_number)
      VALUES
        (1, 'MLD1014', 'SERVICIOS VARIOS', 'activo', '1-33175642'),
        (2, 'MLD1014', 'AUXILIO MORTUORIO', 'activo', '1-33175741'),
        (3, 'MLD1014', 'PRÉSTAMOS Y DIVIDENDOS', 'activo', '1-33175676'),
        (4, 'MLD1014', 'FONDO DE RETIRO Y CUOTA MORTUORIA', 'activo', '1-33175733')
    `);

    await queryRunner.query(`
      SELECT setval(
        pg_get_serial_sequence('${getSchema(queryRunner)}.accounts', 'id'),
        (SELECT MAX(id) FROM ${getSchema(queryRunner)}.accounts)
      )
    `);

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
      INSERT INTO ${getSchema(queryRunner)}.financial_entities (id, name, code, is_active)
      VALUES
        (1, 'MUTUAL DE SERVICIOS AL POLICÍA', 'MUS', true),
        (2, 'BANCO BISA S.A.', 'BIS', true),
        (3, 'BANCO DE CRÉDITO DE BOLIVIA S.A.', 'BCR', true),
        (4, 'BANCO PYME ECOFUTURO S.A.', 'PEF', true),
        (5, 'BANCO ECONOMICO S.A.', 'BEC', true),
        (6, 'BANCO FIE (BANCO PARA EL FOMENTO A INICIATIVAS ECONÓMICAS S.A.)', 'BIE', true),
        (7, 'BANCO FORTALEZA S.A.', 'BFO', true),
        (8, 'BANCO GANADERO S.A.', 'BGA', true),
        (9, 'BANCO MERCANTIL SANTA CRUZ S.A.', 'BME', true),
        (10, 'BANCO DE LA NACIÓN ARGENTINA', 'BNA', true),
        (11, 'BANCO NACIONAL DE BOLIVIA S.A.', 'BNB', true),
        (12, 'BANCO SOLIDARIO S.A.', 'BSO', true),
        (13, 'BANCO PRODEM S.A.', 'BPR', true),
        (14, 'BANCO UNIÓN S.A.', 'BUN', true),
        (15, 'BANCO FASSIL S.A.', 'FAS', false)
    `);

    await queryRunner.query(`
      SELECT setval(
        pg_get_serial_sequence('${getSchema(queryRunner)}.financial_entities', 'id'),
        (SELECT MAX(id) FROM ${getSchema(queryRunner)}.financial_entities)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(`${getSchema(queryRunner)}.financial_entities`);
    await queryRunner.dropTable(`${getSchema(queryRunner)}.accounts`);
  }
}
