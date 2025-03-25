import { Controller, Param, Patch } from '@nestjs/common';
import * as output from '@/app/boundaries/dto/output';
import { PreferencesService } from './preferences.service';
import { randomUUID } from 'crypto';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly _preferencesService: PreferencesService) {}

  @Patch('authors/:id/toggle')
  async toggleAuthor(
    @Param('id') authorId: string,
  ): Promise<output.ToggleAuthorOutput> {
    return this._preferencesService.toggleAuthor(authorId, randomUUID());
  }

  @Patch('posts/:id/toggle')
  async togglePost(
    @Param('id') postId: string,
  ): Promise<output.ToggleAuthorOutput> {
    return this._preferencesService.togglePost(postId, randomUUID());
  }
}
