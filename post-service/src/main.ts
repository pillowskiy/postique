import { NestFactory } from '@nestjs/core';
import AppModule from '@/infrastructure/app.module';
import { PostsRMQService } from '@/infrastructure/rabbitmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rmqService = app.get(PostsRMQService);
  app.connectMicroservice(rmqService.getOptions());

  await app.startAllMicroservices();
}

bootstrap();
