import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { PreferencesRepository } from '@/app/boundaries/repository';
import { Inject } from '@nestjs/common';
import { PostPreferencesEntity } from '@/domain/preferences';
import { TogglePostOutput } from '@/app/boundaries/dto/output';
import { TogglePostCommand } from './toggle-post.command';
import { PreferencesAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException } from '@/app/boundaries/errors';

@CommandHandler(TogglePostCommand)
export class TogglePostCommandHandler extends Command<
  TogglePostCommand,
  TogglePostOutput
> {
  @Inject(PreferencesAccessControlList)
  private readonly _preferencesACL: PreferencesAccessControlList;

  @Inject(PreferencesRepository)
  private readonly _preferencesRepository: PreferencesRepository;

  protected async invoke(input: TogglePostCommand): Promise<TogglePostOutput> {
    let prefs = await this._preferencesRepository.preferences(
      input.initiatedBy,
    );

    if (!prefs) {
      prefs = PostPreferencesEntity.empty(input.initiatedBy);
    }

    const hasPermission = await this._preferencesACL.canModify(
      input.initiatedBy,
      prefs,
    );
    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to modify this preferences',
      );
    }

    const isMuted = prefs.isPostMuted(input.postId);
    if (isMuted) {
      prefs.unmutePost(input.postId);
    } else {
      prefs.mutePost(input.postId);
    }

    await this._preferencesRepository.save(input.initiatedBy, prefs);
    return new TogglePostOutput(isMuted);
  }
}
