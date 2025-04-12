import {
  Controller,
  Param,
  Post,
  Delete,
  Body,
  UseGuards,
  Get,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import { AuthGuard } from '@/infrastructure/common/guards';
import { InitiatedBy } from '@/infrastructure/common/decorators';
import { CollectionsService } from './collections.service';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly _collectionsService: CollectionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCollection(
    @Body() collection: input.CreateBookmarkCollectionInput,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.CreateBookmarkCollectionOutput> {
    return this._collectionsService.createCollection(
      collection.name,
      initiatedBy,
      collection.description,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCollection(
    @Param('id', ParseUUIDPipe) collectionId: string,
    @InitiatedBy() initiatedBy: string,
  ) {
    return this._collectionsService.deleteCollection(collectionId, initiatedBy);
  }

  @Get(':id/bookmarks')
  @UseGuards(AuthGuard)
  async getCollectionBookmarks(
    @Param('id', ParseUUIDPipe) collectionId: string,
    @InitiatedBy() initiatedBy: string,
    @Query('cursor') cursor?: string,
    @Query('pageSize') pageSize?: number,
  ): Promise<output.CursorOutput<output.DetailedBookmarkOutput>> {
    return this._collectionsService.getCollectionBookmarks(
      collectionId,
      initiatedBy,
      cursor,
      pageSize,
    );
  }

  @Get('users/:userId')
  @UseGuards(AuthGuard)
  async getUserCollections(
    @Param('userId', ParseUUIDPipe) userId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.DetailedBookmarkCollectionOutput[]> {
    return this._collectionsService.getUserCollections(userId, initiatedBy);
  }
}
