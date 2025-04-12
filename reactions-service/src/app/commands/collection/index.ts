import { ICommandHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { CreateCollectionCommandHandler } from './create';
import { DeleteCollectionCommandHandler } from './delete';

const handlers: Type<ICommandHandler>[] = [
  CreateCollectionCommandHandler,
  DeleteCollectionCommandHandler,
];

export default handlers;
