import { BookmarkCollectionAccessControlList } from '@/app/boundaries/acl';
import { CreateBookmarkCollectionOutput } from '@/app/boundaries/dto/output';
import { ForbiddenException } from '@/app/boundaries/errors';
import { BookmarkCollectionRepository } from '@/app/boundaries/repository';
import { BookmarkCollectionEntity } from '@/domain/collection';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { CreateCollectionCommand } from './create-collection.command';

@CommandHandler(CreateCollectionCommand)
export class CreateCollectionCommandHandler extends Command<
  CreateCollectionCommand,
  CreateBookmarkCollectionOutput
> {
  @Inject(BookmarkCollectionAccessControlList)
  private readonly _collectionACL: BookmarkCollectionAccessControlList;

  @Inject(BookmarkCollectionRepository)
  private readonly _collectionRepository: BookmarkCollectionRepository;

  protected async invoke(
    input: CreateCollectionCommand,
  ): Promise<CreateBookmarkCollectionOutput> {
    const hasPermission = await this._collectionACL.canCreate(
      input.initiatedBy,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to create bookmark collections',
      );
    }

    const collection = BookmarkCollectionEntity.create({
      userId: input.initiatedBy,
      name: input.name,
      description: input.description,
    });
    await this._collectionRepository.save(collection);

    return new CreateBookmarkCollectionOutput(collection.id);
  }
}
