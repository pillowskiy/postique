import { ICommandHandler } from '@nestjs/cqrs';
import { TogglePostCommandHandler } from './toggle-post';
import { ToggleAuthorCommandHandler } from './toggle-author';
import { Type } from '@nestjs/common';

const handlers: Type<ICommandHandler>[] = [
  TogglePostCommandHandler,
  ToggleAuthorCommandHandler,
];

export default handlers;
