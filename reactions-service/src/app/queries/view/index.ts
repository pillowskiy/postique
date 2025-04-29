import type { Type } from '@nestjs/common';
import type { IQueryHandler } from '@nestjs/cqrs';
import { GetHistoryQueryHandler } from './get-history';

const handlers: Type<IQueryHandler>[] = [GetHistoryQueryHandler];

export default handlers;
