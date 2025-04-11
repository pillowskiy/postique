import { ICommandHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { AddBookmarkCommandHandler } from './add-bookmark';
import { DeleteBookmarkCommandHandler } from './delete-bookmark';

const handlers: Type<ICommandHandler>[] = [
  AddBookmarkCommandHandler,
  DeleteBookmarkCommandHandler,
];

export default handlers;
