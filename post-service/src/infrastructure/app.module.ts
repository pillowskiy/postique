import { Module } from '@nestjs/common';
import { RabbitMQModule } from './rabbitmq';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [AppConfigModule, RabbitMQModule],
})
export default class AppModule {}
