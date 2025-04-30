import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { AddBookmarkCommand } from './add-bookmark.command';
import { BookmarkRepository } from '@/app/boundaries/repository';
import { BookmarkEntity } from '@/domain/bookmark';
import { AddBookmarkOutput } from '@/app/boundaries/dto/output';
import { BookmarkAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException } from '@/app/boundaries/errors';
import { ReactedEvent, ReactionType } from '@/app/events/interaction/reacted';

@CommandHandler(AddBookmarkCommand)
export class AddBookmarkCommandHandler extends Command<
  AddBookmarkCommand,
  AddBookmarkOutput
> {
  @Inject(BookmarkAccessControlList)
  private readonly _bookmarkACL: BookmarkAccessControlList;

  @Inject(BookmarkRepository)
  private readonly _bookmarkRepository: BookmarkRepository;

  @Inject(EventBus)
  private readonly _eventBus: EventBus;

  protected async invoke(
    input: AddBookmarkCommand,
  ): Promise<AddBookmarkOutput> {
    const hasPermission = await this._bookmarkACL.canAdd(
      input.initiatedBy,
      input.targetId,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to bookmark this content',
      );
    }

    const storedBookmark = await this._bookmarkRepository.findUserBookmark(
      input.initiatedBy,
      input.targetId,
      input.collectionId,
    );

    if (storedBookmark) {
      return new AddBookmarkOutput(storedBookmark.id);
    }

    const bookmark = BookmarkEntity.create({
      userId: input.initiatedBy,
      targetId: input.targetId,
      collectionId: input.collectionId,
    });

    await this._bookmarkRepository.save(bookmark);

    this._eventBus.publish(
      new ReactedEvent(bookmark.targetId, ReactionType.Bookmark, true),
    );

    return new AddBookmarkOutput(bookmark.id);
  }
}
