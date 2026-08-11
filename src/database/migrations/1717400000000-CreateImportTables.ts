import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateImportTables1717400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS global');

    await queryRunner.createTable(
      new Table({
        name: 'import_configs',
        schema: 'global',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'microservice',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'schema',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'table',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'skip_rows',
            type: 'int',
            default: 0,
          },
          {
            name: 'start_column',
            type: 'int',
            default: 1,
          },
          {
            name: 'column_mappings',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'delimiter',
            type: 'varchar',
            default: ',',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'import_records',
        schema: 'global',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'target',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'ftp_path',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'original_file_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'file_hash',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'uploaded_by',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'row_start',
            type: 'int',
            default: 0,
          },
          {
            name: 'row_end',
            type: 'int',
            default: 0,
          },
          {
            name: 'total_rows',
            type: 'int',
            default: 0,
          },
          {
            name: 'processed_rows',
            type: 'int',
            default: 0,
          },
          {
            name: 'status',
            type: 'varchar',
            default: 'PENDING',
          },
          {
            name: 'error_message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('global.import_records');
    await queryRunner.dropTable('global.import_configs');
  }
}
