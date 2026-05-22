# Global-Service

## Inicio Rápido

```bash
pnpm install
cp .env.template .env
pnpm start:dev
```

## Migraciones

```bash
# Ver estado de migraciones
pnpm run migration:show

# Ejecutar migraciones pendientes
pnpm run migration:run

# Revertir la última migración
pnpm run migration:revert
```

## Seeders

```bash
# Ejecutar seeders legacy del proyecto
pnpm run seed:run
```

`seed:run` ejecuta los seeders de `src/database/seeds/` y su objetivo es poblar catálogos en base de datos.

En este proyecto, esos seeders son legacy del módulo de `aportes` o `contribuciones`. El flujo es este:

- `001-aportes-modules.seed.ts`: crea el módulo base en `modules`
- `002-aportes-procedure-types.seed.ts`: crea los tipos de trámite
- `003-aportes-procedure-modalities.seed.ts`: crea las modalidades
- `004-aportes-procedure-documents.seed.ts`: crea el catálogo de documentos
- `005-aportes-procedure-requirements.seed.ts`: placeholder, hoy no inserta datos reales

Importante:

- `seed:run` no es obligatorio para levantar el proyecto
- primero se deben ejecutar migraciones con `pnpm run migration:run`
- estos seeders pueden fallar si tu base no tiene la estructura esperada por el módulo de `aportes`
- por ejemplo, si la tabla `modules` no coincide con la entidad actual, `seed:run` puede dar error