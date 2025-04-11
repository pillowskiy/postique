import { ICommandHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { ToggleLikeCommandHandler } from './toggle-like';

const handlers: Type<ICommandHandler>[] = [ToggleLikeCommandHandler];

export default handlers;
