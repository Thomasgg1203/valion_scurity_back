import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const env = (process.env.NODE_ENV as 'development' | 'test' | 'production') || 'development';
  const port = process.env.PORT || 3000;

  app.use(helmet());
  app.use(compression());
  app.use(json({ limit: '50mb' }));

  const corsOrigins = process.env[`CORS_ORIGINS_${env.toUpperCase()}`]
    ?.split(',')
    .map((o) => o.trim()) || ['*'];

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Valion Security')
    .setDescription('Official Valion Security API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorizations: true },
  });

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(port);

  Logger.log(`✅ Environment: ${env}`, 'Bootstrap');
  Logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
  Logger.log(`🌍 Allowed origins: ${corsOrigins.join(', ')}`, 'CORS');
  Logger.log(`📘 Swagger docs available at http://localhost:${port}/api/docs`, 'Swagger');
}

bootstrap();
