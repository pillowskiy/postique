import { Module } from '@nestjs/common';
import { AppConfigModule } from '@/infrastructure/config';
import { PostsRMQService } from './posts.service';

@Module({
  imports: [AppConfigModule],
  providers: [PostsRMQService],
  exports: [PostsRMQService],
})
export class RabbitMQModule {}
