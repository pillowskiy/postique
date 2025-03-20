import { Logger } from '@/app/boundaries/common';
import AppModule from '@/infrastructure/app.module';
import { AppConfigService } from '@/infrastructure/globals/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ApplicationExceptionFilter } from '@/infrastructure/common/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  const appLogger = await app.resolve(Logger);
  app.useLogger(appLogger);
  app.setGlobalPrefix('/api/v1');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.useGlobalFilters(app.get(ApplicationExceptionFilter));

  const config = app.get(AppConfigService);
  await app.listen(config.get('PORT'), '0.0.0.0');
}

void bootstrap();
