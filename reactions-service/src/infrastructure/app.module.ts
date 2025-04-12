import { Module } from '@nestjs/common';
import { AppConfigModule } from '@/infrastructure/globals/config';
import { DrizzleModule } from './drizzle';
import { RabbitMQModule } from './rabbitmq';
import { ComponentsModule } from './components/components.module';

@Module({
  imports: [AppConfigModule, DrizzleModule, RabbitMQModule, ComponentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
