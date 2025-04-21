import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { FindBatchQueryHandler } from './find-batch';

const handlers: Type<IQueryHandler>[] = [FindBatchQueryHandler];

export default handlers;
