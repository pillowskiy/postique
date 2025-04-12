import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/infrastructure/app.module';
import { AppConfigService } from '@/infrastructure/globals/config';
import {
  RabbitMQPostsService,
  RabbitMQUsersService,
} from './infrastructure/rabbitmq';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  app.setGlobalPrefix('/api/v1');

  await app.init();

  app.connectMicroservice(app.get(RabbitMQUsersService).getOptions());
  app.connectMicroservice(app.get(RabbitMQPostsService).getOptions());

  const config = app.get(AppConfigService);
  await app.listen(config.get('PORT'), '0.0.0.0');
  await app.startAllMicroservices();
}
void bootstrap();
