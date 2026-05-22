import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountsTable1779408000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "global"`);

    await queryRunner.query(`
      CREATE TYPE "global"."accounts_state_enum" AS ENUM (
        'activo',
        'inactivo',
        'bloqueado'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "global"."accounts" (
        "id" BIGSERIAL NOT NULL,
        "eif" character varying(20) NOT NULL,
        "name" character varying(150) NOT NULL,
        "state" "global"."accounts_state_enum" NOT NULL DEFAULT 'activo',
        "account_number" character varying(50) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP NULL,
        CONSTRAINT "UQ_accounts_account_number" UNIQUE ("account_number"),
        CONSTRAINT "PK_accounts_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "global"."accounts" ("id", "eif", "name", "state", "account_number")
      VALUES
        (1, 'MLD1014', 'SERVICIOS VARIOS', 'activo', '1-33175642'),
        (2, 'MLD1014', 'AUXILIO MORTUORIO', 'activo', '1-33175741'),
        (3, 'MLD1014', 'PRÉSTAMOS Y DIVIDENDOS', 'activo', '1-33175676'),
        (4, 'MLD1014', 'FONDO DE RETIRO Y CUOTA MORTUORIA', 'activo', '1-33175733')
    `);

    await queryRunner.query(`
      SELECT setval(
        pg_get_serial_sequence('"global"."accounts"', 'id'),
        COALESCE((SELECT MAX(id) FROM "global"."accounts"), 1),
        true
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "global"."accounts"`);
    await queryRunner.query(`DROP TYPE "global"."accounts_state_enum"`);
  }
}
