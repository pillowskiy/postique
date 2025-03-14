import type { Type } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';

import { CreatePostCommandHandler } from './create';
import { ChangePostContentCommandHandler } from './change-content';
import { ChangePostVisibilityCommandHandler } from './change-visibility';
import { ArchivePostCommandHandler } from './archive';
import { PublishPostCommandHandler } from './publish';
import { DeletePostCommandHandler } from './delete';
import { TransferPostOwnershipCommandHandler } from './transfer-ownership';

const handlers: Type<ICommandHandler>[] = [
  CreatePostCommandHandler,
  ChangePostContentCommandHandler,
  ChangePostVisibilityCommandHandler,
  ArchivePostCommandHandler,
  PublishPostCommandHandler,
  DeletePostCommandHandler,
  TransferPostOwnershipCommandHandler,
];
export default handlers;
