import type { Type } from '@nestjs/common';
import type { IQueryHandler } from '@nestjs/cqrs';

import { GetPostsBlacklistQueryHandler } from './get-posts-blacklist';
import { GetAuthorBlacklistQueryHandler } from './get-author-blacklist';

const handlers: Type<IQueryHandler>[] = [
  GetPostsBlacklistQueryHandler,
  GetAuthorBlacklistQueryHandler,
];

export default handlers;
