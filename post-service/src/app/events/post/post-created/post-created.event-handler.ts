import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PostCreatedEvent } from './post-created.event';
import { PostPublisher } from '@/app/boundaries/providers';

@EventsHandler(PostCreatedEvent)
export class PostCreatedEventHandler
  implements IEventHandler<PostCreatedEvent>
{
  constructor(private readonly _publisher: PostPublisher) {}

  handle(event: PostCreatedEvent) {
    console.log(`Got event post created with payload`, event);
    void this._publisher.publishCreated(event);
  }
}
