import { DetailedBookmarkCollectionOutput } from '@/app/boundaries/dto/output';
import { Query } from '../../common';
import { QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { BookmarkCollectionRepository } from '@/app/boundaries/repository';
import { BookmarkCollectionMapper } from '@/app/boundaries/mapper';
import { GetDetailedCollectionQuery } from './get-detailed.query';

@QueryHandler(GetDetailedCollectionQuery)
export class GetDetailedCollectionQueryHandler extends Query<
  GetDetailedCollectionQuery,
  DetailedBookmarkCollectionOutput
> {
  @Inject(BookmarkCollectionRepository)
  private readonly _collectionRepository: BookmarkCollectionRepository;

  protected async invoke(
    query: GetDetailedCollectionQuery,
  ): Promise<DetailedBookmarkCollectionOutput> {
    const collection = await this._collectionRepository.getBySlug(query.slug);

    if (!collection) {
      throw new NotFoundException('Collection does not exist');
    }

    return BookmarkCollectionMapper.toDetailedDto(collection);
  }
}
