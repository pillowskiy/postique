import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PostModifiedEvent } from './post-modified.event';
import { PostPublisher } from '@/app/boundaries/providers';

@EventsHandler(PostModifiedEvent)
export class PostModifiedEventHandler
  implements IEventHandler<PostModifiedEvent>
{
  constructor(private readonly _publisher: PostPublisher) {}

  handle(event: PostModifiedEvent) {
    void this._publisher.publishModified(event);
  }
}
