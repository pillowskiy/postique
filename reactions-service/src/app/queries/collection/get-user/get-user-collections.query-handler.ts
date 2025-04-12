import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Query } from '../../common';
import { GetUserCollectionsQuery } from './get-user-collections.query';
import { BookmarkCollectionRepository } from '@/app/boundaries/repository';
import { BookmarkCollectionOutput } from '@/app/boundaries/dto/output';
import { BookmarkCollectionMapper } from '@/app/boundaries/mapper';

@QueryHandler(GetUserCollectionsQuery)
export class GetUserCollectionsQueryHandler extends Query<
  GetUserCollectionsQuery,
  BookmarkCollectionOutput[]
> {
  @Inject(BookmarkCollectionRepository)
  private readonly _collectionRepository: BookmarkCollectionRepository;

  protected async invoke(
    query: GetUserCollectionsQuery,
  ): Promise<BookmarkCollectionOutput[]> {
    const collections = await this._collectionRepository.findByUser(
      query.userId,
    );

    return collections.map((collection) =>
      BookmarkCollectionMapper.toDetailedDto(collection),
    );
  }
}
