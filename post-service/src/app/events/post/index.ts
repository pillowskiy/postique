import { Type } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { PostCreatedEventHandler } from './post-created';
import { PostModifiedEventHandler } from './post-modified';

const handlers: Type<IEventHandler>[] = [
  PostCreatedEventHandler,
  PostModifiedEventHandler,
];

export default handlers;
