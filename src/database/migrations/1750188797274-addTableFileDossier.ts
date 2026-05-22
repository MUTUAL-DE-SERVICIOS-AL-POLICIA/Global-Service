import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddTableFileDossier1750188797274 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "global"`);

    await queryRunner.createTable(
      new Table({
        schema: 'global',
        name: 'file_dossiers',
        columns: [
          {
            name: 'id',
            type: 'bigserial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'shortened',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.query(`
        INSERT INTO global.file_dossiers (name, shortened)
        VALUES 
        ('Fondo de Retiro', 'FR'),
        ('Complemento Económico', 'CE');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "global"."file_dossiers"`);
  }
}
