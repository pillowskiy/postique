import type { Type } from '@nestjs/common';
import type { IQueryHandler } from '@nestjs/cqrs';

import { GetDetailedSeriesQueryHandler } from './get-detailed';
import { GetMySeriesesQueryHandler } from './get-my-serieses';
import { GetPostSeriesesQueryHandler } from './get-post-serieses';

const handlers: Type<IQueryHandler>[] = [
  GetDetailedSeriesQueryHandler,
  GetMySeriesesQueryHandler,
  GetPostSeriesesQueryHandler,
];

export default handlers;
