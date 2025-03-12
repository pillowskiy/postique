import type { Type } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';

import { CreatePostCommandHandler } from './create-post';

const handlers: Type<ICommandHandler>[] = [CreatePostCommandHandler];
export default handlers;
