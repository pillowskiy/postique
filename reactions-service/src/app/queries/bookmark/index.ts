import { IQueryHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { GetCollectionBookmarksQueryHandler } from './get-collection';
import { GetUserBookmarksQueryHandler } from './get-user';
import { GetWatchlistQueryHandler } from './get-watchlist';

const handlers: Type<IQueryHandler>[] = [
  GetCollectionBookmarksQueryHandler,
  GetUserBookmarksQueryHandler,
  GetWatchlistQueryHandler,
];

export default handlers;
