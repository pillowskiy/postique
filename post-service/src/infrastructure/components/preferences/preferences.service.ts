import {
  ToggleAuthorOutput,
  TogglePostOutput,
} from '@/app/boundaries/dto/output';
import { ToggleAuthorCommand } from '@/app/commands/preferences/toggle-author';
import { TogglePostCommand } from '@/app/commands/preferences/toggle-post';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class PreferencesService {
  constructor(private readonly _commandBus: CommandBus) {}

  async togglePost(postId: string, userId: string): Promise<TogglePostOutput> {
    return this._commandBus.execute<TogglePostCommand, TogglePostOutput>(
      new TogglePostCommand(postId, userId),
    );
  }

  async toggleAuthor(
    authorId: string,
    userId: string,
  ): Promise<ToggleAuthorOutput> {
    return this._commandBus.execute<ToggleAuthorCommand, ToggleAuthorOutput>(
      new ToggleAuthorCommand(authorId, userId),
    );
  }
}
