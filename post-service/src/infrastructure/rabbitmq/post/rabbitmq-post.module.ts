import { Module } from '@nestjs/common';
import {
  AppConfigModule,
  AppConfigService,
} from '@/infrastructure/globals/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { PostPublisher } from '@/app/boundaries/providers';
import { RabbitMQPostPublisher } from './rabbitmq-post-pub.provider';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        queue: configService.get('RABBIT_MQ_POSTS_QUEUE'),
        exchanges: [
          {
            name: configService.get('RABBIT_MQ_POSTS_EXCHANGE'),
            type: 'fanout',
          },
        ],
        uri: configService.get('RABBIT_MQ_POSTS_URL'),
        persistent: true,
        connectionInitOptions: { wait: true },
        queueOptions: {
          durable: true,
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [
    {
      provide: PostPublisher,
      useClass: RabbitMQPostPublisher,
    },
  ],
  exports: [PostPublisher],
})
export class RabbitMQPostModule {}
