import { Injectable } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { AppConfigService } from '@/infrastructure/globals/config';

@Injectable()
export class UsersRMQService {
  constructor(private readonly _configService: AppConfigService) {}

  getOptions(noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        noAck,
        urls: [this._configService.get('RABBIT_MQ_USERS_URL')],
        exchange: this._configService.get('RABBIT_MQ_USERS_EXCHANGE'),
        persistent: true,
        queueOptions: {
          durable: true,
        },
        queue: this._configService.get('RABBIT_MQ_USERS_QUEUE'),
      },
    };
  }
}
