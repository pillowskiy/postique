import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@/infrastructure/globals/config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  type IPostPayload,
  type IPostWithContentPayload,
  PostPublisher,
} from '@/app/boundaries/providers';

@Injectable()
export class RabbitMQPostPublisher extends PostPublisher {
  constructor(
    private readonly _configService: AppConfigService,
    private readonly _ampqConnection: AmqpConnection,
  ) {
    super();
  }

  async publishCreated(post: IPostPayload): Promise<void> {
    await this._publish('', 'post.created', post);
  }

  async publishModified(post: IPostPayload): Promise<void> {
    await this._publish('', 'post.modified', post);
  }

  async publishPublished(post: IPostWithContentPayload): Promise<void> {
    await this._publish('', 'post.published', post);
  }

  private _publish(
    routingKey: string,
    pattern: string,
    payload: Record<string, any>,
  ) {
    return this._ampqConnection.publish(
      this._configService.get('RABBIT_MQ_POSTS_EXCHANGE'),
      routingKey,
      {
        pattern,
        data: payload,
      },
      {
        persistent: true,
        contentType: 'application/json',
      },
    );
  }
}
