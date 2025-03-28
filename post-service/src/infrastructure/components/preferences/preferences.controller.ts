import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import * as output from '@/app/boundaries/dto/output';
import { PreferencesService } from './preferences.service';
import { randomUUID } from 'crypto';
import { AuthGuard } from '@/infrastructure/common/guards';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly _preferencesService: PreferencesService) {}

  @Patch('authors/:id/toggle')
  @UseGuards(AuthGuard)
  async toggleAuthor(
    @Param('id') authorId: string,
  ): Promise<output.ToggleAuthorOutput> {
    return this._preferencesService.toggleAuthor(authorId, randomUUID());
  }

  @Patch('posts/:id/toggle')
  @UseGuards(AuthGuard)
  async togglePost(
    @Param('id') postId: string,
  ): Promise<output.ToggleAuthorOutput> {
    return this._preferencesService.togglePost(postId, randomUUID());
  }
}
