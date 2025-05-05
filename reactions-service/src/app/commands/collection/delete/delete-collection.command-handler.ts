import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { DeleteCollectionCommand } from './delete-collection.command';
import { BookmarkCollectionRepository } from '@/app/boundaries/repository';
import { DeleteBookmarkCollectionOutput } from '@/app/boundaries/dto/output';
import { BookmarkCollectionAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException, NotFoundException } from '@/app/boundaries/errors';

@CommandHandler(DeleteCollectionCommand)
export class DeleteCollectionCommandHandler extends Command<
  DeleteCollectionCommand,
  DeleteBookmarkCollectionOutput
> {
  @Inject(BookmarkCollectionAccessControlList)
  private readonly _collectionACL: BookmarkCollectionAccessControlList;

  @Inject(BookmarkCollectionRepository)
  private readonly _collectionRepository: BookmarkCollectionRepository;

  protected async invoke(
    input: DeleteCollectionCommand,
  ): Promise<DeleteBookmarkCollectionOutput> {
    const collection = await this._collectionRepository.findById(input.id);

    if (!collection) {
      throw new NotFoundException('Bookmark collection not found');
    }

    const hasPermission = await this._collectionACL.canDelete(
      input.initiatedBy,
      collection,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to delete this bookmark collection',
      );
    }

    await this._collectionRepository.delete(collection.id);

    return new DeleteBookmarkCollectionOutput(collection.id);
  }
}
