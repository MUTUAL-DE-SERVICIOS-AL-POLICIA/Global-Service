import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_AUTO_LOAD_ENTITIES: boolean;
  DB_SYNCHRONIZE: boolean;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_AUTO_LOAD_ENTITIES: joi.boolean().default(true),
    DB_SYNCHRONIZE: joi.boolean().default(false),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

//Configuración del puerto de micro servicio
export const PortEnvs = {
  port: envVars.PORT,
};
//Configuración con el servidor
export const NastEnvs = {
  natsServers: envVars.NATS_SERVERS,
};
//Configuración con la base de datos principal
export const DbEnvs = {
  dbPassword: envVars.DB_PASSWORD,
  dbDatabase: envVars.DB_DATABASE,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUsername: envVars.DB_USERNAME,
  dbAutoLoadEntities: envVars.DB_AUTO_LOAD_ENTITIES,
  dbSynchronize: envVars.DB_SYNCHRONIZE,
};
