import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { DeleteBookmarkCommand } from './delete-bookmark.command';
import { BookmarkRepository } from '@/app/boundaries/repository';
import { DeleteBookmarkOutput } from '@/app/boundaries/dto/output';
import { BookmarkAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException, NotFoundException } from '@/app/boundaries/errors';

@CommandHandler(DeleteBookmarkCommand)
export class DeleteBookmarkCommandHandler extends Command<
  DeleteBookmarkCommand,
  DeleteBookmarkOutput
> {
  @Inject(BookmarkAccessControlList)
  private readonly _bookmarkACL: BookmarkAccessControlList;

  @Inject(BookmarkRepository)
  private readonly _bookmarkRepository: BookmarkRepository;

  protected async invoke(
    input: DeleteBookmarkCommand,
  ): Promise<DeleteBookmarkOutput> {
    const bookmark = await this._bookmarkRepository.findUserBookmark(
      input.initiatedBy,
      input.targetId,
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

    return new DeleteBookmarkOutput(bookmark.id);
  }
}
