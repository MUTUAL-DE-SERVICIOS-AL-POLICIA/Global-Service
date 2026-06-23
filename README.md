# Global-Service

Microservicio NestJS para datos globales de la plataforma. Usa PostgreSQL,
TypeORM, NATS y `pnpm`.

## Inicio rapido

```bash
cp .env.template .env
pnpm install
pnpm start:dev
```

## Variables principales

Configura el archivo `.env` antes de iniciar el servicio.

```env
NATS_SERVERS=nats://localhost:4222
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=procedures_services
DB_SCHEMA=global
DB_SYNCHRONIZE=false
```

## Migraciones

```bash
pnpm migration:show
pnpm migration:run
pnpm migration:revert
```

El esquema usado por defecto es `global`, definido en `DB_SCHEMA`.

## Seeders

Ejecutar todos los seeders pendientes:

```bash
pnpm seed:run
```

Ejecutar un seeder especifico:

```bash
pnpm seed:run -- --name src/database/seeds/1782244316611-accounts-seeder-bcb.ts
```

Crear un seeder nuevo:

```bash
pnpm seed:create --name src/database/seeds/nombre-del-seed
```

## Comandos utiles

```bash
pnpm start:dev
pnpm build
pnpm test
pnpm lint
```

## Generar recursos NestJS

```bash
nest g res nombreModulo
```

## Flujo recomendado

```bash
pnpm install
pnpm migration:run
pnpm seed:run
pnpm start:dev
```
