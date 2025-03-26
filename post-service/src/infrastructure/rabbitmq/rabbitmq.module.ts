import { AppConfigModule } from '@/infrastructure/globals/config';
import { Module } from '@nestjs/common';
import { UsersRMQService } from './users.service';

@Module({
  imports: [AppConfigModule],
  providers: [UsersRMQService],
  exports: [UsersRMQService],
})
export class RabbitMQModule {}
