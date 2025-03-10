import { Injectable } from '@nestjs/common';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { AppConfigService } from '@/infrastructure/config';

@Injectable()
export class PostsRMQService {
  constructor(private readonly _configService: AppConfigService) {}

  getOptions(noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        noAck,
        urls: [this._configService.get('RABBIT_MQ_URI')],
        persistent: true,
        queue: this._configService.get('RABBIT_MQ_POSTS_QUEUE'),
      },
    };
  }
}
