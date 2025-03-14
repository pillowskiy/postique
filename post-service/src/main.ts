import AppModule from '@/infrastructure/app.module';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppConfigService } from './infrastructure/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  await app.init();

  app.setGlobalPrefix('/api/v1');
  const config = app.get(AppConfigService);
  await app.listen(config.get('PORT'), '0.0.0.0');
}

void bootstrap();
