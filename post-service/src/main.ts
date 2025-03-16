import { Logger } from '@/app/boundaries/common';
import AppModule from '@/infrastructure/app.module';
import { AppConfigService } from '@/infrastructure/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  const appLogger = await app.resolve(Logger);
  app.useLogger(appLogger);
  app.setGlobalPrefix('/api/v1');

  const config = app.get(AppConfigService);
  await app.listen(config.get('PORT'), '0.0.0.0');
}

void bootstrap();
