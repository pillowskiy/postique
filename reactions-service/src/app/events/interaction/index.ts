import { Type } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { ReactedEventHandler } from './reacted';

const handlers: Type<IEventHandler>[] = [ReactedEventHandler];

export default handlers;
