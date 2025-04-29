import { CommandHandler } from '@nestjs/cqrs';
import { ClearHistoryCommand } from './clear-history.command';
import { Command } from '../../common';
import { ClearHistoryOutput } from '@/app/boundaries/dto/output';
import { ViewRepository } from '@/app/boundaries/repository';
import { Inject } from '@nestjs/common';
import { ViewAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException } from '@/app/boundaries/errors';

@CommandHandler(ClearHistoryCommand)
export class ClearHistoryCommandHandler extends Command<
  ClearHistoryCommand,
  ClearHistoryOutput
> {
  @Inject(ViewRepository)
  private readonly _viewRepository: ViewRepository;

  @Inject(ViewAccessControlList)
  private readonly _viewACL: ViewAccessControlList;

  protected async invoke(
    input: ClearHistoryCommand,
  ): Promise<ClearHistoryOutput> {
    // NOTE: We do not use an event bus to decrement the view count of targetIds in the history.
    // Currently, we simply remove the user's view record, which may lead to business logic inconsistencies in the future.
    // Ideally, history should be modeled as a value object or even an entity, but for now, simpler approach is used. (MVP ;) )

    const canClear = await this._viewACL.canClearHistory(input.initiatedBy, {
      userId: input.initiatedBy,
    });

    if (!canClear) {
      throw new ForbiddenException('You cannot clear history of this user');
    }

    await this._viewRepository.deleteByUser(input.initiatedBy);

    return new ClearHistoryOutput();
  }
}
