import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateBookmarkCollectionOutput,
  DetailedBookmarkCollectionOutput,
} from '@/app/boundaries/dto/output';
import { CreateCollectionCommand } from '@/app/commands/collection/create';
import { DeleteCollectionCommand } from '@/app/commands/collection/delete';
import { GetUserCollectionsQuery } from '@/app/queries/collection/get-user';
import { IdentifierDto } from '@/app/boundaries/dto/common';
import { GetDetailedCollectionQuery } from '@/app/queries/collection/get-detailed';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  async createCollection(
    name: string,
    initiatedBy: string,
    description?: string,
  ): Promise<CreateBookmarkCollectionOutput> {
    return this._commandBus.execute<
      CreateCollectionCommand,
      CreateBookmarkCollectionOutput
    >(new CreateCollectionCommand(name, initiatedBy, description));
  }

  async deleteCollection(
    collectionId: string,
    initiatedBy: string,
  ): Promise<IdentifierDto> {
    return this._commandBus.execute<DeleteCollectionCommand, IdentifierDto>(
      new DeleteCollectionCommand(collectionId, initiatedBy),
    );
  }

  async getDetailedCollection(
    slug: string,
    requestedBy?: string,
  ): Promise<DetailedBookmarkCollectionOutput> {
    return this._queryBus.execute<
      GetDetailedCollectionQuery,
      DetailedBookmarkCollectionOutput
    >(new GetDetailedCollectionQuery(slug, requestedBy));
  }

  async getUserCollections(
    userId: string,
    requestedBy?: string,
  ): Promise<DetailedBookmarkCollectionOutput[]> {
    return this._queryBus.execute<
      GetUserCollectionsQuery,
      DetailedBookmarkCollectionOutput[]
    >(new GetUserCollectionsQuery(userId, requestedBy));
  }
}
