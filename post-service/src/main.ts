import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@/app/boundaries/common';
import AppModule from '@/infrastructure/app.module';
import { AppConfigService } from '@/infrastructure/globals/config';
import { ApplicationExceptionFilter } from '@/infrastructure/common/filters';
import { UsersRMQService } from '@/infrastructure/rabbitmq';
import compression from '@fastify/compress';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  const appLogger = await app.resolve(Logger);
  app.useLogger(appLogger);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(app.get(ApplicationExceptionFilter));
  await app.register(compression, { encodings: ['gzip', 'deflate'] });

  await app.init();
  app.connectMicroservice(app.get(UsersRMQService).getOptions());

  const config = app.get(AppConfigService);
  await app.listen(config.get('PORT'), '0.0.0.0');
  await app.startAllMicroservices();
}

void bootstrap();
