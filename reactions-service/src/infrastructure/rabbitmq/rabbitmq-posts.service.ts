import { Injectable } from '@nestjs/common';
import { RmqOptions, ServerRMQ } from '@nestjs/microservices';
import { AppConfigService } from '@/infrastructure/globals/config';
import {
  CustomTransport,
  SpecificTransportEventPattern,
} from './rabbitmq.strategy';

export const RMQ_POSTS_TRANSPORT = Symbol('RMQ_USERS_TRANSPORT');

@CustomTransport(RMQ_POSTS_TRANSPORT)
export class ServerPostsRMQ extends ServerRMQ {}

export const PostsEventPattern =
  SpecificTransportEventPattern(RMQ_POSTS_TRANSPORT);

@Injectable()
export class RabbitMQPostsService {
  constructor(private readonly _configService: AppConfigService) {}

  getOptions(noAck = false): RmqOptions | { strategy: ServerRMQ } {
    return {
      strategy: new ServerPostsRMQ({
        urls: [this._configService.get('RABBIT_MQ_POSTS_URL')],
        queue: this._configService.get('RABBIT_MQ_POSTS_QUEUE'),
        exchange: this._configService.get('RABBIT_MQ_POSTS_EXCHANGE'),
        persistent: true,
        queueOptions: {
          durable: true,
        },
        noAck,
      }),
    };
  }
}
