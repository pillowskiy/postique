import type { Type } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';

import { SaveUserCommandHandler } from './save';

const handlers: Type<ICommandHandler>[] = [SaveUserCommandHandler];

export default handlers;
