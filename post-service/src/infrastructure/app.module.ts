import { Module } from '@nestjs/common';
import { ApplicationExceptionFilter } from '@/infrastructure/common/filters';
import { AppConfigModule } from '@/infrastructure/globals/config';
import { LoggerModule } from '@/infrastructure/globals/logger';
import { RabbitMQModule } from '@/infrastructure/rabbitmq';
import { ComponentsModule } from '@/infrastructure/components';

@Module({
  imports: [AppConfigModule, RabbitMQModule, LoggerModule, ComponentsModule],
  providers: [ApplicationExceptionFilter],
})
export default class AppModule {}
