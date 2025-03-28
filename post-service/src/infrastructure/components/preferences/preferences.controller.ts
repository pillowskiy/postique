import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as output from '@/app/boundaries/dto/output';
import { PreferencesService } from './preferences.service';
import { randomUUID } from 'crypto';
import { AuthGuard } from '@/infrastructure/common/guards';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly _preferencesService: PreferencesService) {}

  @Patch('authors/:id')
  @UseGuards(AuthGuard)
  async toggleAuthor(
    @Param('id') authorId: string,
  ): Promise<output.ToggleAuthorOutput> {
    return this._preferencesService.toggleAuthor(authorId, randomUUID());
  }

  @Patch('posts/:id')
  @UseGuards(AuthGuard)
  async togglePost(
    @Param('id') postId: string,
  ): Promise<output.ToggleAuthorOutput> {
    return this._preferencesService.togglePost(postId, randomUUID());
  }

  @Get('posts')
  @UseGuards(AuthGuard)
  async getPostsBlacklist(
    @Query('take') take: number,
    @Query('skip') skip: number,
  ): Promise<output.Paginated<output.Post>> {
    return this._preferencesService.getPostsBlacklist(randomUUID(), take, skip);
  }

  @Get('authors')
  @UseGuards(AuthGuard)
  async getAuthorBlacklist(
    @Query('take') take: number,
    @Query('skip') skip: number,
  ): Promise<output.Paginated<output.User>> {
    return this._preferencesService.getAuthorBlacklist(
      randomUUID(),
      take,
      skip,
    );
  }
}
