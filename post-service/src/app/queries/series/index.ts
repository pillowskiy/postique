import type { Type } from '@nestjs/common';
import type { IQueryHandler } from '@nestjs/cqrs';

import { GetMySeriesesQueryHandler } from './get-my-serieses';
import { GetPostSeriesesQueryHandler } from './get-post-serieses';

const handlers: Type<IQueryHandler>[] = [
  GetMySeriesesQueryHandler,
  GetPostSeriesesQueryHandler,
];

export default handlers;
