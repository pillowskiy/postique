import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { AddBookmarkCommand } from './add-bookmark.command';
import { BookmarkRepository } from '@/app/boundaries/repository';
import { BookmarkEntity } from '@/domain/bookmark';
import { AddBookmarkOutput } from '@/app/boundaries/dto/output';
import { BookmarkAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException } from '@/app/boundaries/errors';

@CommandHandler(AddBookmarkCommand)
export class AddBookmarkCommandHandler extends Command<
  AddBookmarkCommand,
  AddBookmarkOutput
> {
  @Inject(BookmarkAccessControlList)
  private readonly _bookmarkACL: BookmarkAccessControlList;

  @Inject(BookmarkRepository)
  private readonly _bookmarkRepository: BookmarkRepository;

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

    const bookmark = BookmarkEntity.create({
      userId: input.initiatedBy,
      targetId: input.targetId,
      collectionId: input.collectionId,
    });

    await this._bookmarkRepository.save(bookmark);

    return new AddBookmarkOutput(bookmark.id);
  }
}
