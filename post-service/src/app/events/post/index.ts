import { Type } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { PostCreatedEventHandler } from './post-created';
import { PostModifiedEventHandler } from './post-modified';
import { PostPublishedEventHandler } from './post-published';

const handlers: Type<IEventHandler>[] = [
  PostCreatedEventHandler,
  PostModifiedEventHandler,
  PostPublishedEventHandler,
];

export default handlers;
