import { IQueryHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { GetCommentRepliesQueryHandler } from './get-replies';
import { GetPostCommentsQueryHandler } from './get-comments';

const handlers: Type<IQueryHandler>[] = [
  GetPostCommentsQueryHandler,
  GetCommentRepliesQueryHandler,
];

export default handlers;
