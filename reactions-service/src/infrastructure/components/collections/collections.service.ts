import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateBookmarkCollectionOutput,
  DetailedBookmarkCollectionOutput,
  DetailedBookmarkOutput,
  CursorOutput,
} from '@/app/boundaries/dto/output';
import { CreateCollectionCommand } from '@/app/commands/collection/create';
import { DeleteCollectionCommand } from '@/app/commands/collection/delete';
import { GetUserCollectionsQuery } from '@/app/queries/collection/get-user';
import { GetCollectionBookmarksQuery } from '@/app/queries/bookmark/get-collection';
import { IdentifierDto } from '@/app/boundaries/dto/common';

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

  async getCollectionBookmarks(
    collectionId: string,
    requestedBy: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<CursorOutput<DetailedBookmarkOutput>> {
    return this._queryBus.execute<
      GetCollectionBookmarksQuery,
      CursorOutput<DetailedBookmarkOutput>
    >(
      new GetCollectionBookmarksQuery(
        collectionId,
        requestedBy,
        cursor,
        pageSize,
      ),
    );
  }

  async getUserCollections(
    userId: string,
    requestedBy: string,
  ): Promise<DetailedBookmarkCollectionOutput[]> {
    return this._queryBus.execute<
      GetUserCollectionsQuery,
      DetailedBookmarkCollectionOutput[]
    >(new GetUserCollectionsQuery(userId, requestedBy));
  }
}
