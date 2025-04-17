import type { Type } from '@nestjs/common';
import type { IQueryHandler } from '@nestjs/cqrs';

import { GetDetailedPostQueryHandler } from './get-detailed';
import { GetMyPostsQueryHandler } from './get-my-posts';
import { GetPostListQueryHandler } from './get-post-list';
import { GetPostDraftQueryHandler } from './get-draft';
import { GetPostInfoQueryHandler } from './get-info';

const handlers: Type<IQueryHandler>[] = [
  GetDetailedPostQueryHandler,
  GetPostDraftQueryHandler,
  GetPostInfoQueryHandler,
  GetMyPostsQueryHandler,
  GetPostListQueryHandler,
];
export default handlers;
