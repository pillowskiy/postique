import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AddBookmarkOutput,
  DeleteBookmarkOutput,
  DetailedBookmarkOutput,
  CursorOutput,
} from '@/app/boundaries/dto/output';
import { AddBookmarkCommand } from '@/app/commands/bookmark/add-bookmark';
import { DeleteBookmarkCommand } from '@/app/commands/bookmark/delete-bookmark';
import { GetUserBookmarksQuery } from '@/app/queries/bookmark/get-user';

@Injectable()
export class BookmarksService {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  async addBookmark(
    targetId: string,
    initiatedBy: string,
    collectionId?: string,
  ): Promise<AddBookmarkOutput> {
    return this._commandBus.execute<AddBookmarkCommand, AddBookmarkOutput>(
      new AddBookmarkCommand(targetId, initiatedBy, collectionId),
    );
  }

  async deleteBookmark(
    targetId: string,
    initiatedBy: string,
  ): Promise<DeleteBookmarkOutput> {
    return this._commandBus.execute<
      DeleteBookmarkCommand,
      DeleteBookmarkOutput
    >(new DeleteBookmarkCommand(targetId, initiatedBy));
  }

  async getUserBookmarks(
    userId: string,
    requestedBy: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<CursorOutput<DetailedBookmarkOutput>> {
    return this._queryBus.execute<
      GetUserBookmarksQuery,
      CursorOutput<DetailedBookmarkOutput>
    >(new GetUserBookmarksQuery(userId, requestedBy, cursor, pageSize));
  }
}
