import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@/infrastructure/rabbitmq';
import { AppConfigModule } from '@/infrastructure/globals/config';
import { PostsModule } from '@/infrastructure/delivery/posts';
import { LoggerModule } from '@/infrastructure/globals/logger';
import { ApplicationExceptionFilter } from '@/infrastructure/common/filters';

@Module({
  imports: [AppConfigModule, RabbitMQModule, PostsModule, LoggerModule],
  providers: [ApplicationExceptionFilter],
})
export default class AppModule {}
