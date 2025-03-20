import { AppConfigModule } from '@/infrastructure/globals/config';
import { Module } from '@nestjs/common';
import { PostsRMQService } from './posts.service';

@Module({
  imports: [AppConfigModule],
  providers: [PostsRMQService],
  exports: [PostsRMQService],
})
export class RabbitMQModule {}
