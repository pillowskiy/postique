import * as output from '@/app/boundaries/dto/output';
import {
  InitiatedBy,
  OptionalInitiatedBy,
} from '@/infrastructure/common/decorators';
import { AuthGuard, OptionalAuthGuard } from '@/infrastructure/common/guards';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post(':targetId')
  @UseGuards(AuthGuard)
  async addBookmark(
    @Param('targetId', ParseUUIDPipe) targetId: string,
    @Query('collectionId', new ParseUUIDPipe({ optional: true }))
    collectionId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.AddBookmarkOutput> {
    return this.bookmarksService.addBookmark(
      targetId,
      collectionId ?? null,
      initiatedBy,
    );
  }

  @Delete(':targetId')
  @UseGuards(AuthGuard)
  async deleteBookmark(
    @Param('targetId', ParseUUIDPipe) targetId: string,
    @Query('collectionId', new ParseUUIDPipe({ optional: true }))
    collectionId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.DeleteBookmarkOutput> {
    return this.bookmarksService.deleteBookmark(
      targetId,
      collectionId ?? null,
      initiatedBy,
    );
  }

  @Get('users/:userId')
  @UseGuards(AuthGuard)
  async getUserBookmarks(
    @Param('userId', ParseUUIDPipe) userId: string,
    @InitiatedBy() initiatedBy: string,
    @Query('cursor') cursor?: string,
    @Query('pageSize') pageSize?: number,
  ): Promise<output.CursorOutput<output.BookmarkOutput>> {
    return this.bookmarksService.getUserBookmarks(
      userId,
      initiatedBy,
      cursor,
      pageSize,
    );
  }

  @Get('watchlist')
  @UseGuards(AuthGuard)
  async getWatchlistBookmarks(
    @InitiatedBy() initiatedBy: string,
    @Query('cursor') cursor?: string,
    @Query('pageSize') pageSize?: number,
  ): Promise<output.CursorOutput<output.BookmarkOutput>> {
    return this.bookmarksService.getWatchlistBookmarks(
      initiatedBy,
      initiatedBy,
      cursor,
      pageSize,
    );
  }

  @Get('list/:collectionId')
  @UseGuards(OptionalAuthGuard)
  async getCollectionBookmarks(
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
    @OptionalInitiatedBy() initiatedBy?: string,
    @Query('cursor') cursor?: string,
    @Query('pageSize') pageSize?: number,
  ): Promise<output.CursorOutput<output.BookmarkOutput>> {
    return this.bookmarksService.getCollectionBookmarks(
      collectionId,
      initiatedBy,
      cursor,
      pageSize,
    );
  }
}
