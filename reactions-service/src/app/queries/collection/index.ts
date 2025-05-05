import { IQueryHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { GetUserCollectionsQueryHandler } from './get-user';
import { GetDetailedCollectionQueryHandler } from './get-detailed';

const handlers: Type<IQueryHandler>[] = [
  GetUserCollectionsQueryHandler,
  GetDetailedCollectionQueryHandler,
];

export default handlers;
