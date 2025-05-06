import {
  AddBookmarkOutput,
  BookmarkOutput,
  CursorOutput,
  DeleteBookmarkOutput,
  DetailedBookmarkOutput,
} from '@/app/boundaries/dto/output';
import { AddBookmarkCommand } from '@/app/commands/bookmark/add-bookmark';
import { DeleteBookmarkCommand } from '@/app/commands/bookmark/delete-bookmark';
import { GetCollectionBookmarksQuery } from '@/app/queries/bookmark/get-collection';
import { GetUserBookmarksQuery } from '@/app/queries/bookmark/get-user';
import { GetWatchlistQuery } from '@/app/queries/bookmark/get-watchlist';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class BookmarksService {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  async addBookmark(
    targetId: string,
    collectionId: string | null,
    initiatedBy: string,
  ): Promise<AddBookmarkOutput> {
    return this._commandBus.execute<AddBookmarkCommand, AddBookmarkOutput>(
      new AddBookmarkCommand(targetId, collectionId, initiatedBy),
    );
  }

  async deleteBookmark(
    targetId: string,
    collectionId: string,
    initiatedBy: string,
  ): Promise<DeleteBookmarkOutput> {
    return this._commandBus.execute<
      DeleteBookmarkCommand,
      DeleteBookmarkOutput
    >(new DeleteBookmarkCommand(targetId, collectionId, initiatedBy));
  }

  async getUserBookmarks(
    userId: string,
    requestedBy: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<CursorOutput<BookmarkOutput>> {
    return this._queryBus.execute<
      GetUserBookmarksQuery,
      CursorOutput<BookmarkOutput>
    >(new GetUserBookmarksQuery(userId, requestedBy, cursor, pageSize));
  }

  async getWatchlistBookmarks(
    userId: string,
    requestedBy: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<CursorOutput<DetailedBookmarkOutput>> {
    return this._queryBus.execute<
      GetWatchlistQuery,
      CursorOutput<DetailedBookmarkOutput>
    >(new GetWatchlistQuery(userId, requestedBy, cursor, pageSize));
  }

  async getCollectionBookmarks(
    collectionId: string,
    requestedBy?: string,
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
}
