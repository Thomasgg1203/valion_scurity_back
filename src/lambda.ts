/**
 * Entrypoint para AWS Lambda
 *
 * Este archivo permite correr la aplicación NestJS
 * en un entorno serverless, como AWS Lambda + API Gateway.
 */

import { Handler, Context, Callback } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';

let server: Handler;

// Función para inicializar NestJS solo una vez (cold start)
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableCors(); // Habilitar CORS si tu API se va a consumir desde frontends
  await app.init(); // Inicializa NestJS
  return serverlessExpress({ app });
}

// Handler principal que AWS Lambda llamará
export const handler = async (event: any, context: Context, callback: Callback) => {
  // Inicializa server si aún no lo hemos hecho (optimización cold start)
  if (!server) {
    server = await bootstrap();
  }
  return server(event, context, callback);
};
