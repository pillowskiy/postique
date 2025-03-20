import { ApplicationExceptionFilter } from '@/infrastructure/common/filters';
import { PostsModule } from '@/infrastructure/components/posts';
import { AppConfigModule } from '@/infrastructure/globals/config';
import { LoggerModule } from '@/infrastructure/globals/logger';
import { RabbitMQModule } from '@/infrastructure/rabbitmq';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule, RabbitMQModule, PostsModule, LoggerModule],
  providers: [ApplicationExceptionFilter],
})
export default class AppModule {}
