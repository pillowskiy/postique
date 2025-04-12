import { AppConfigModule } from '@/infrastructure/globals/config';
import { Module } from '@nestjs/common';
import { RabbitMQUsersService } from './rabbitmq-users.module';
import { RabbitMQPostsService } from './rabbitmq-posts.service';

@Module({
  imports: [AppConfigModule],
  providers: [RabbitMQUsersService, RabbitMQPostsService],
  exports: [RabbitMQUsersService, RabbitMQPostsService],
})
export class RabbitMQModule {}
