import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { FindBatchQueryHandler } from './find-batch';
import { GetBatchStatsQueryHandler } from './get-batch-stats';

const handlers: Type<IQueryHandler>[] = [
  FindBatchQueryHandler,
  GetBatchStatsQueryHandler,
];

export default handlers;
