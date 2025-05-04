import { PostPublisher } from '@/app/boundaries/providers';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PostPublishedEvent } from './post-published.event';

@EventsHandler(PostPublishedEvent)
export class PostPublishedEventHandler
  implements IEventHandler<PostPublishedEvent>
{
  constructor(private readonly _publisher: PostPublisher) {}

  handle(event: PostPublishedEvent) {
    void this._publisher.publishPublished(event);
  }
}
