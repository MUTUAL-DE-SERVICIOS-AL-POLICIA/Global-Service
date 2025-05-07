import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUrlsToModules1685467894567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar las columnas urlProd, urlDev, y urlManual
    await queryRunner.addColumns('public.modules', [
      new TableColumn({
        name: 'urlProd',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'urlDev',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'urlManual',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar las columnas si se revierte la migración
    await queryRunner.dropColumns('public.modules', [
      'urlProd',
      'urlDev',
      'urlManual',
    ]);
  }
}
