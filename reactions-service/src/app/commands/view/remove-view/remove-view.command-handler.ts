import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { RemoveViewOutput } from '@/app/boundaries/dto/output';
import { ViewRepository } from '@/app/boundaries/repository';
import { Inject } from '@nestjs/common';
import { ViewAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException, NotFoundException } from '@/app/boundaries/errors';
import { RemoveViewCommand } from './remove-view.command';

@CommandHandler(RemoveViewCommand)
export class RemoveViewCommandHandler extends Command<
  RemoveViewCommand,
  RemoveViewOutput
> {
  @Inject(ViewRepository)
  private readonly _viewRepository: ViewRepository;

  @Inject(ViewAccessControlList)
  private readonly _viewACL: ViewAccessControlList;

  protected async invoke(input: RemoveViewCommand): Promise<RemoveViewOutput> {
    // NOTE: We do not use an event bus to decrement the view count of targetIds in the history.
    // Currently, we simply remove the user's view record, which may lead to business logic inconsistencies in the future.
    // Ideally, history should be modeled as a value object or even an entity, but for now, simpler approach is used. (MVP ;) )

    const view = await this._viewRepository.findUserView(
      input.initiatedBy,
      input.postId,
    );

    if (!view) {
      throw new NotFoundException('View not found');
    }

    const canRemove = await this._viewACL.canRemoveView(
      input.initiatedBy,
      view,
    );
    if (!canRemove) {
      throw new ForbiddenException('You cannot remove this view');
    }

    await this._viewRepository.delete(input.initiatedBy, input.postId);

    return new RemoveViewOutput();
  }
}
