import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@/infrastructure/globals/config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PostPayload, PostPublisher } from '@/app/boundaries/providers';
import { PostOutput } from '@/app/boundaries/dto/output';

@Injectable()
export class RabbitMQPostPublisher extends PostPublisher {
  constructor(
    private readonly _configService: AppConfigService,
    private readonly _ampqConnection: AmqpConnection,
  ) {
    super();
  }

  async publishCreated(post: PostPayload): Promise<void> {
    await this._publish('', 'post.created', post);
  }

  async publishModified(post: PostPayload): Promise<void> {
    await this._publish('', 'post.modified', post);
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
