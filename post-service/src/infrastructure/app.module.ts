import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@/infrastructure/rabbitmq';
import { AppConfigModule } from '@/infrastructure/config';
import { PostsModule } from '@/infrastructure/delivery/posts';
import { LoggerModule } from './logger/logger.module';
import { ApplicationExceptionFilter } from './common/filters';

@Module({
  imports: [AppConfigModule, RabbitMQModule, PostsModule, LoggerModule],
  providers: [ApplicationExceptionFilter],
})
export default class AppModule {}
