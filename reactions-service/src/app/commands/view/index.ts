import { ICommandHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { RegisterViewCommandHandler } from './register-view';
import { ClearHistoryCommandHandler } from './clear-history';
import { RemoveViewCommandHandler } from './remove-view';

const handlers: Type<ICommandHandler>[] = [
  RegisterViewCommandHandler,
  ClearHistoryCommandHandler,
  RemoveViewCommandHandler,
];

export default handlers;
