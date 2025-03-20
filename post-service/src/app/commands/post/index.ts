import type { Type } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';

import { CreatePostCommandHandler } from './create';
import { ChangePostVisibilityCommandHandler } from './change-visibility';
import { ArchivePostCommandHandler } from './archive';
import { PublishPostCommandHandler } from './publish';
import { DeletePostCommandHandler } from './delete';
import { TransferPostOwnershipCommandHandler } from './transfer-ownership';

const handlers: Type<ICommandHandler>[] = [
  CreatePostCommandHandler,
  ChangePostVisibilityCommandHandler,
  ArchivePostCommandHandler,
  PublishPostCommandHandler,
  DeletePostCommandHandler,
  TransferPostOwnershipCommandHandler,
];
export default handlers;
