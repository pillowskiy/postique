import { BookmarkAccessControlList } from '@/app/boundaries/acl';
import { DeleteBookmarkOutput } from '@/app/boundaries/dto/output';
import { ForbiddenException, NotFoundException } from '@/app/boundaries/errors';
import { BookmarkRepository } from '@/app/boundaries/repository';
import { ReactedEvent, ReactionType } from '@/app/events/interaction/reacted';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Command } from '../../common';
import { DeleteBookmarkCommand } from './delete-bookmark.command';

@CommandHandler(DeleteBookmarkCommand)
export class DeleteBookmarkCommandHandler extends Command<
  DeleteBookmarkCommand,
  DeleteBookmarkOutput
> {
  @Inject(BookmarkAccessControlList)
  private readonly _bookmarkACL: BookmarkAccessControlList;

  @Inject(BookmarkRepository)
  private readonly _bookmarkRepository: BookmarkRepository;

  @Inject(EventBus)
  private readonly _eventBus: EventBus;

  protected async invoke(
    input: DeleteBookmarkCommand,
  ): Promise<DeleteBookmarkOutput> {
    const bookmark = await this._bookmarkRepository.findUserBookmark(
      input.initiatedBy,
      input.targetId,
      input.collectionId,
    );

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    const hasPermission = await this._bookmarkACL.canDelete(
      input.initiatedBy,
      bookmark,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to remove this bookmark',
      );
    }

    await this._bookmarkRepository.delete(bookmark.id);

    this._eventBus.publish(
      new ReactedEvent(bookmark.targetId, ReactionType.Bookmark, false),
    );

    return new DeleteBookmarkOutput(bookmark.id);
  }
}
