import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@/infrastructure/rabbitmq';
import { AppConfigModule } from '@/infrastructure/config';
import { PostsModule } from '@/infrastructure/delivery/posts';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [AppConfigModule, RabbitMQModule, PostsModule, LoggerModule],
})
export default class AppModule {}
