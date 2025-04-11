import { ICommandHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { RegisterViewCommandHandler } from './register-view';

const handlers: Type<ICommandHandler>[] = [RegisterViewCommandHandler];

export default handlers;
