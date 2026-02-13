## Descripción 

Microservicio de obtención de información de Tablas Globales

## Instalar dependencias necesarias después de clonar el repositorio

```bash
$ yarn install
```
## Configurar las variables de entorno

```bash
$ cp .env.example .env
```

## Pata correr el microservicio

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

# Para generar la Documentacion de TSDoc a HTML

## con TypeDoc busca y genera en base a las etiquetas TsDoc un html

### usar el siguiente comando para generarlo y se creara un archivo Doc entrar y abrir el index.html para ver la documentacion de Global Service (solo de controladores servicios y dto's por el momento)

### en caso de cambiar modicar parametros de la generacion de TypeDoc modificar el archivo typedoc.json
```sh
yarn docs
```
