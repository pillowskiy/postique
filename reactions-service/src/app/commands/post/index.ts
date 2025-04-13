import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommandHandler } from './create';
import { EditPostCommandHandler } from './edit';

const handlers: Type<ICommandHandler>[] = [
  CreatePostCommandHandler,
  EditPostCommandHandler,
];

export default handlers;
