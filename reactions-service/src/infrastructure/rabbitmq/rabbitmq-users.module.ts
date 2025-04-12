import { Injectable } from '@nestjs/common';
import { RmqOptions, ServerRMQ } from '@nestjs/microservices';
import { AppConfigService } from '@/infrastructure/globals/config';
import {
  CustomTransport,
  SpecificTransportEventPattern,
} from './rabbitmq.strategy';

export const RMQ_USERS_TRANSPORT = Symbol('RMQ_USERS_TRANSPORT');

@CustomTransport(RMQ_USERS_TRANSPORT)
export class ServerUsersRMQ extends ServerRMQ {}

export const UsersEventPattern =
  SpecificTransportEventPattern(RMQ_USERS_TRANSPORT);

@Injectable()
export class RabbitMQUsersService {
  constructor(private readonly _configService: AppConfigService) {}

  getOptions(noAck = false): RmqOptions | { strategy: ServerRMQ } {
    return {
      strategy: new ServerUsersRMQ({
        urls: [this._configService.get('RABBIT_MQ_USERS_URL')],
        queue: this._configService.get('RABBIT_MQ_USERS_QUEUE'),
        exchange: this._configService.get('RABBIT_MQ_USERS_EXCHANGE'),
        persistent: true,
        queueOptions: {
          durable: true,
        },
        noAck,
      }),
    };
  }
}
