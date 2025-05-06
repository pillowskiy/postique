import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import {
  InitiatedBy,
  OptionalInitiatedBy,
} from '@/infrastructure/common/decorators';
import { AuthGuard, OptionalAuthGuard } from '@/infrastructure/common/guards';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @Get(':slug')
  @UseGuards(OptionalAuthGuard)
  async getDetailedCollection(
    @Param('slug') slug: string,
    @OptionalInitiatedBy() initiatedBy?: string,
  ): Promise<output.DetailedBookmarkCollectionOutput> {
    return this._collectionsService.getDetailedCollection(slug, initiatedBy);
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
