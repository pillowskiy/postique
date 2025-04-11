import { ICommandHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { CreateCommentCommandHandler } from './create-comment';
import { EditCommentCommandHandler } from './edit-comment';
import { DeleteCommentCommandHandler } from './delete-comment';

const handlers: Type<ICommandHandler>[] = [
  CreateCommentCommandHandler,
  EditCommentCommandHandler,
  DeleteCommentCommandHandler,
];

export default handlers;
