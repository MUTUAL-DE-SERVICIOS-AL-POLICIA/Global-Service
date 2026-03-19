# Global-Service

## Descripción

**Global-Service** es un microservicio que gestiona la configuración global y funcionalidades transversales de la plataforma. Centraliza datos, configuraciones y servicios compartidos que son utilizados por todos los demás microservicios, proporcionando un punto único de control y estandarización.

Maneja datos como:
- Configuración global de la plataforma
- Parámetros y valores compartidos entre servicios
- Catálogos y datos maestros
- Configuración de reglas de negocio
- Información de sistema y versioning
- Valores por defecto y políticas generales


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
