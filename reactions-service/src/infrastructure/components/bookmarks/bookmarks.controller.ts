import {
  Controller,
  Param,
  Post,
  Delete,
  Body,
  UseGuards,
  Get,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import { AuthGuard } from '@/infrastructure/common/guards';
import { InitiatedBy } from '@/infrastructure/common/decorators';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @UseGuards(AuthGuard)
  async addBookmark(
    @Body() bookmark: input.CreateBookmarkInput,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.AddBookmarkOutput> {
    return this.bookmarksService.addBookmark(
      bookmark.targetId,
      initiatedBy,
      bookmark.collectionId,
    );
  }

  @Delete(':targetId')
  @UseGuards(AuthGuard)
  async deleteBookmark(
    @Param('targetId', ParseUUIDPipe) targetId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.DeleteBookmarkOutput> {
    return this.bookmarksService.deleteBookmark(targetId, initiatedBy);
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
