import { IQueryHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { GetCollectionBookmarksQueryHandler } from './get-collection';
import { GetUserBookmarksQueryHandler } from './get-user';

const handlers: Type<IQueryHandler>[] = [
  GetCollectionBookmarksQueryHandler,
  GetUserBookmarksQueryHandler,
];

export default handlers;
