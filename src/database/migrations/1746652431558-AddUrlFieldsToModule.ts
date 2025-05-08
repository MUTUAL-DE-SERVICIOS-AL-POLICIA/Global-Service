import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUrlsToModules1685467894567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar las columnas urlProd, urlDev, y urlManual
    await queryRunner.addColumns('public.modules', [
      new TableColumn({
        name: 'url_prod',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'url_dev',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'url_manual',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'url_test',
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
