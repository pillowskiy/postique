import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as output from '@/app/boundaries/dto/output';
import { PreferencesService } from './preferences.service';
import { AuthGuard } from '@/infrastructure/common/guards';
import { InitiatedBy } from '@/infrastructure/common/decorators';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly _preferencesService: PreferencesService) {}

  @Patch('authors/:id')
  @UseGuards(AuthGuard)
  async toggleAuthor(
    @Param('id', ParseUUIDPipe) authorId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.ToggleAuthorOutput> {
    return this._preferencesService.toggleAuthor(authorId, initiatedBy);
  }

  @Patch('posts/:id')
  @UseGuards(AuthGuard)
  async togglePost(
    @Param('id', ParseUUIDPipe) postId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.ToggleAuthorOutput> {
    return this._preferencesService.togglePost(postId, initiatedBy);
  }

  @Get('posts')
  @UseGuards(AuthGuard)
  async getPostsBlacklist(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.PaginatedOutput<output.PostOutput>> {
    return this._preferencesService.getPostsBlacklist(initiatedBy, take, skip);
  }

  @Get('authors')
  @UseGuards(AuthGuard)
  async getAuthorBlacklist(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.PaginatedOutput<output.UserOutput>> {
    return this._preferencesService.getAuthorBlacklist(initiatedBy, take, skip);
  }
}
