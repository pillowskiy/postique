import { IQueryHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { GetUserCollectionsQueryHandler } from './get-user';

const handlers: Type<IQueryHandler>[] = [GetUserCollectionsQueryHandler];

export default handlers;
