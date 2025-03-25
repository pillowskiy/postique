import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';

import { CreateSeriesCommandHandler } from './create';
import { DeleteSeriesCommandHandler } from './delete';
import { UpdateSeriesCommandHandler } from './update';
import { AddSeriesPostCommandHandler } from './add-post';
import { RemoveSeriesPostCommandHandler } from './remove-post';

const handlers: Type<ICommandHandler>[] = [
  CreateSeriesCommandHandler,
  DeleteSeriesCommandHandler,
  UpdateSeriesCommandHandler,
  AddSeriesPostCommandHandler,
  RemoveSeriesPostCommandHandler,
];

export default handlers;
