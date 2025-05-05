import { PreferencesAccessControlList } from '@/app/boundaries/acl';
import { ToggleAuthorOutput } from '@/app/boundaries/dto/output';
import { ForbiddenException } from '@/app/boundaries/errors';
import { PreferencesRepository } from '@/app/boundaries/repository';
import { DomainBusinessRuleViolation } from '@/domain/common/error';
import { PostPreferencesEntity } from '@/domain/preferences';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { ToggleAuthorCommand } from './toggle-author.command';

@CommandHandler(ToggleAuthorCommand)
export class ToggleAuthorCommandHandler extends Command<
  ToggleAuthorCommand,
  ToggleAuthorOutput
> {
  @Inject(PreferencesAccessControlList)
  private readonly _preferencesACL: PreferencesAccessControlList;

  @Inject(PreferencesRepository)
  private readonly _preferencesRepository: PreferencesRepository;

  protected async invoke(
    input: ToggleAuthorCommand,
  ): Promise<ToggleAuthorOutput> {
    if (input.authorId === input.initiatedBy) {
      throw new DomainBusinessRuleViolation('You cannot mute/unmute yourself');
    }

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

    const isMuted = prefs.isAuthorMuted(input.authorId);
    if (isMuted) {
      prefs.unmuteAuthor(input.authorId);
    } else {
      prefs.muteAuthor(input.authorId);
    }

    await this._preferencesRepository.save(input.initiatedBy, prefs);
    return new ToggleAuthorOutput(isMuted);
  }
}
