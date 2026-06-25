import { MigrationInterface, QueryRunner, Table } from 'typeorm';

function getSchema(queryRunner: QueryRunner): string {
  const options = queryRunner.connection.options as { schema?: string };
  return options.schema ?? 'global';
}

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

const LOCAL_TIMESTAMP = "(CURRENT_TIMESTAMP AT TIME ZONE 'America/La_Paz')";

interface ReferencingForeignKey {
  table_schema: string;
  table_name: string;
  constraint_name: string;
  constraint_definition: string;
}

async function getReferencingForeignKeys(
  queryRunner: QueryRunner,
): Promise<ReferencingForeignKey[]> {
  return queryRunner.query(`
    SELECT
      namespace.nspname AS table_schema,
      class.relname AS table_name,
      constraint_info.conname AS constraint_name,
      pg_get_constraintdef(constraint_info.oid) AS constraint_definition
    FROM pg_constraint constraint_info
    INNER JOIN pg_class class
      ON class.oid = constraint_info.conrelid
    INNER JOIN pg_namespace namespace
      ON namespace.oid = class.relnamespace
    WHERE constraint_info.contype = 'f'
      AND constraint_info.confrelid = 'public.financial_entities'::regclass
    ORDER BY namespace.nspname, class.relname, constraint_info.conname
  `);
}

async function dropReferencingForeignKeys(
  queryRunner: QueryRunner,
  foreignKeys: ReferencingForeignKey[],
): Promise<void> {
  for (const foreignKey of foreignKeys) {
    await queryRunner.query(`
      ALTER TABLE ${quoteIdentifier(foreignKey.table_schema)}.${quoteIdentifier(foreignKey.table_name)}
      DROP CONSTRAINT ${quoteIdentifier(foreignKey.constraint_name)}
    `);
  }
}

async function createReferencingForeignKeys(
  queryRunner: QueryRunner,
  foreignKeys: ReferencingForeignKey[],
): Promise<void> {
  for (const foreignKey of foreignKeys) {
    await queryRunner.query(`
      ALTER TABLE ${quoteIdentifier(foreignKey.table_schema)}.${quoteIdentifier(foreignKey.table_name)}
      ADD CONSTRAINT ${quoteIdentifier(foreignKey.constraint_name)}
      ${foreignKey.constraint_definition}
    `);
  }
}

export class AddTableAccountsAndFinancialEntities1779696000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.financial_entities
        ADD COLUMN IF NOT EXISTS code varchar(10),
        ADD COLUMN IF NOT EXISTS is_active boolean,
        ADD COLUMN IF NOT EXISTS eif varchar(20),
        ADD COLUMN IF NOT EXISTS deleted_at timestamptz
    `);

    await queryRunner.query(`
      UPDATE public.financial_entities
      SET code = null,
          is_active = null,
          eif = null
    `);

    await queryRunner.query(`
      DELETE FROM public.financial_entities
      WHERE id > 14
    `);

    await queryRunner.query(`
      INSERT INTO public.financial_entities
        (id, name, code, is_active, eif, created_at, updated_at)
      VALUES
        (1, 'BANCO UNIÓN S.A.', 'BUN', true, 'MLD1014', ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (2, 'BANCO SOLIDARIO S.A.', 'BSO', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (3, 'BANCO NACIONAL DE BOLIVIA S.A.', 'BNB', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (4, 'BANCO BISA S.A.', 'BIS', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (5, 'BANCO DE CRÉDITO DE BOLIVIA S.A.', 'BCR', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (6, 'BANCO FORTALEZA S.A.', 'BFO', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (7, 'BANCO GANADERO S.A.', 'BGA', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (8, 'BANCO MERCANTIL SANTA CRUZ S.A.', 'BME', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (9, 'MUTUAL DE SERVICIOS AL POLICÍA', 'MUS', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (10, 'BANCO ECONOMICO S.A.', 'BEC', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (11, 'BANCO PRODEM S.A.', 'BPR', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (12, 'BANCO FASSIL S.A.', 'FAS', false, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (13, 'BANCO FIE (BANCO PARA EL FOMENTO A INICIATIVAS ECONÓMICAS S.A.)', 'BIE', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP}),
        (14, 'BANCO PYME ECOFUTURO S.A.', 'PEF', true, null, ${LOCAL_TIMESTAMP}, ${LOCAL_TIMESTAMP})
      ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          code = EXCLUDED.code,
          is_active = EXCLUDED.is_active,
          eif = EXCLUDED.eif,
          updated_at = ${LOCAL_TIMESTAMP}
    `);

    const referencingForeignKeys = await getReferencingForeignKeys(queryRunner);

    await queryRunner.query(`
      DROP TABLE IF EXISTS public.financial_entities_reordered
    `);

    await queryRunner.query(`
      CREATE TABLE public.financial_entities_reordered (
        id integer NOT NULL,
        name varchar(255) NOT NULL,
        code varchar(10),
        is_active boolean,
        eif varchar(20),
        created_at timestamptz NOT NULL DEFAULT ${LOCAL_TIMESTAMP},
        updated_at timestamptz NOT NULL DEFAULT ${LOCAL_TIMESTAMP},
        deleted_at timestamptz,
        CONSTRAINT financial_entities_reordered_pkey PRIMARY KEY (id)
      )
    `);

    await queryRunner.query(`
      INSERT INTO public.financial_entities_reordered
        (id, name, code, is_active, eif, created_at, updated_at, deleted_at)
      SELECT id, name, code, is_active, eif, created_at, updated_at, deleted_at
      FROM public.financial_entities
      ORDER BY id
    `);

    await dropReferencingForeignKeys(queryRunner, referencingForeignKeys);

    await queryRunner.query(`
      DROP TABLE public.financial_entities
    `);

    await queryRunner.query(`
      ALTER TABLE public.financial_entities_reordered
      RENAME TO financial_entities
    `);

    await queryRunner.query(`
      ALTER TABLE public.financial_entities
      RENAME CONSTRAINT financial_entities_reordered_pkey TO financial_entities_pkey
    `);

    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS public.financial_entities_id_seq
    `);

    await queryRunner.query(`
      ALTER TABLE public.financial_entities
      ALTER COLUMN id SET DEFAULT nextval('public.financial_entities_id_seq'::regclass)
    `);

    await queryRunner.query(`
      ALTER SEQUENCE public.financial_entities_id_seq
      OWNED BY public.financial_entities.id
    `);

    await createReferencingForeignKeys(queryRunner, referencingForeignKeys);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS financial_entities_code_unique_idx
      ON public.financial_entities (code)
      WHERE code IS NOT NULL
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS financial_entities_eif_unique_idx
      ON public.financial_entities (eif)
      WHERE eif IS NOT NULL
    `);

    await queryRunner.query(`
      SELECT setval(
        pg_get_serial_sequence('public.financial_entities', 'id'),
        (SELECT MAX(id) FROM public.financial_entities)
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
            default: LOCAL_TIMESTAMP,
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: LOCAL_TIMESTAMP,
            onUpdate: LOCAL_TIMESTAMP,
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
      INSERT INTO ${getSchema(queryRunner)}.accounts
        (id, financial_entity_id, name, state, account_number, cta, ci_nit_titular)
      VALUES
        (1, 1, 'SERVICIOS VARIOS', 'activo', '133175642', '0', '234578021'),
        (2, 1, 'AUXILIO MORTUORIO', 'activo', '133175741', '0', '234578021'),
        (3, 1, 'PRÉSTAMOS Y DIVIDENDOS', 'activo', '133175676', '0', '234578021'),
        (4, 1, 'FONDO DE RETIRO Y CUOTA MORTUORIA', 'activo', '133175733', '0', '234578021')
    `);

    await queryRunner.query(`
      SELECT setval(
        pg_get_serial_sequence('${getSchema(queryRunner)}.accounts', 'id'),
        (SELECT MAX(id) FROM ${getSchema(queryRunner)}.accounts)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(`${getSchema(queryRunner)}.accounts`);

    await queryRunner.query(`
      DROP INDEX IF EXISTS public.financial_entities_eif_unique_idx
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS public.financial_entities_code_unique_idx
    `);

    await queryRunner.query(`
      ALTER TABLE public.financial_entities
        DROP COLUMN IF EXISTS deleted_at,
        DROP COLUMN IF EXISTS eif,
        DROP COLUMN IF EXISTS is_active,
        DROP COLUMN IF EXISTS code
    `);
  }
}
