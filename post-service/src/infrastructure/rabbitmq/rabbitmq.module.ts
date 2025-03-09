import { Module } from '@nestjs/common';
import { PostsRMQService } from './posts.service';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [AppConfigModule],
  providers: [PostsRMQService],
  exports: [PostsRMQService],
})
export class RabbitMQModule {}
