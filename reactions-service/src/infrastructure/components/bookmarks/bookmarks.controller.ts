import * as output from '@/app/boundaries/dto/output';
import { InitiatedBy } from '@/infrastructure/common/decorators';
import { AuthGuard } from '@/infrastructure/common/guards';
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
  ): Promise<output.CursorOutput<output.DetailedBookmarkOutput>> {
    return this.bookmarksService.getUserBookmarks(
      userId,
      initiatedBy,
      cursor,
      pageSize,
    );
  }
}
