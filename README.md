# Global-Service

## Descripción

**Global-Service** es un microservicio que gestiona la configuración global y funcionalidades transversales de la plataforma. Centraliza datos, configuraciones y servicios compartidos que son utilizados por todos los demás microservicios, proporcionando un punto único de control y estandarización. Forma parte de una arquitectura de microservicios basada en **NestJS** y utiliza **NATS** para la comunicación asincrónica entre servicios.

Maneja datos como:
- Configuración global de la plataforma
- Parámetros y valores compartidos entre servicios
- Catálogos y datos maestros
- Configuración de reglas de negocio
- Información de sistema y versioning
- Valores por defecto y políticas generales

---

## Estructura del Proyecto

```
src/
├── app.module.ts                 # Módulo raíz que organiza todos los módulos de la aplicación
├── main.ts                       # Punto de entrada principal de la aplicación
├── config/                       # Módulo de configuración global
│   ├── controllers/              # Controladores de parámetros de configuración
│   ├── services/                 # Servicios de gestión de configuraciones
│   └── dto/                      # Validación de datos de configuración
├── catalogs/                     # Módulo de catálogos y datos maestros
│   ├── controllers/              # Controladores de consulta de catálogos
│   ├── services/                 # Servicios de gestión de datos maestros
│   └── dto/                      # Validación de datos de catálogos
├── parameters/                   # Módulo de parámetros del sistema
│   ├── services/                 # Servicios de gestión de parámetros
│   └── dto/                      # Valores y tipos de parámetros
├── common/                       # Código compartido reutilizable en toda la aplicación
│   ├── filters/                  # Filtros para manejo de excepciones
│   ├── guards/                   # Guards para proteger acceso
│   └── decorators/               # Decoradores personalizados
├── config/                       # Archivos de configuración (BD, variables ENV, etc)
│   └── database.config.ts        # Configuración específica de PostgreSQL
├── database/                     # Gestión de base de datos, migraciones y datos iniciales
│   ├── migrations/               # Migraciones TypeORM para cambios en el esquema BD
│   ├── seeds/                    # Seeders para llenar BD con datos de prueba
│   └── entities/                 # Entidades (modelos) que representan tablas de la BD
```

---

## Clonar el repositorio y agregarle un nombre nuevo del nuevo proyecto

```bash
git clone https://github.com/MUTUAL-DE-SERVICIOS-AL-POLICIA/Global-Service.git nombre-global-service
```

## Inicializar proyecto

```bash
# Entrar al repositorio clonado con el nuevo nombre del proyecto
cd nombre-global-service

# Elimina el origen remoto actual
git remote remove origin

# Crear el archivo .env en base al .env.template
cp .env.template .env

# Instalar las dependencias
pnpm install

# Correr proyecto en modo desarrollo
pnpm start:dev

# Crear nuevo Módulo
nest g res nombreModulo

# Para enlazar a un nuevo repositorio
git remote add origin https://github.com/tu-usuario/{nombre-global-service}.git
git add .
git commit -m "Inicialización del nuevo proyecto"
git branch -M main
git push -u origin main
```

## Ejecutar Seeder

```bash
cd "/home/dgbautista/Escritorio/Denzel AVANCE/Procedures Services Launcher/Procedures-Services-Launcher/Global-Service"
pnpm run seed:run
```
