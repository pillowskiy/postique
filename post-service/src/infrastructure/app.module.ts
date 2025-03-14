import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@/infrastructure/rabbitmq';
import { AppConfigModule } from '@/infrastructure/config';
import { PostsModule } from '@/infrastructure/delivery/posts';

@Module({
  imports: [AppConfigModule, RabbitMQModule, PostsModule],
})
export default class AppModule {}
