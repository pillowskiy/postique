import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@/infrastructure/rabbitmq';
import { AppConfigModule } from '@/infrastructure/config';
import { MongoModule } from '@/infrastructure/mongo';

@Module({
  imports: [AppConfigModule, RabbitMQModule, MongoModule],
})
export default class AppModule {}
