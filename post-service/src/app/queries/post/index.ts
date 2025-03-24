import type { Type } from '@nestjs/common';
import type { IQueryHandler } from '@nestjs/cqrs';

import { GetDetailedPostQueryHandler } from './get-detailed';
import { GetMyPostsQueryHandler } from './get-my-posts';
import { GetPostListQueryHandler } from './get-post-list';

const handlers: Type<IQueryHandler>[] = [
  GetDetailedPostQueryHandler,
  GetMyPostsQueryHandler,
  GetPostListQueryHandler,
];
export default handlers;
