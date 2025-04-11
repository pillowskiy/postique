import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Query } from '../../common';
import { GetCollectionBookmarksQuery } from './get-collection-bookmarks.query';
import { BookmarkRepository } from '@/app/boundaries/repository';
import { BookmarkOutput, CursorOutput } from '@/app/boundaries/dto/output';
import { BookmarkMapper } from '@/app/boundaries/mapper';

@QueryHandler(GetCollectionBookmarksQuery)
export class GetCollectionBookmarksQueryHandler extends Query<
  GetCollectionBookmarksQuery,
  CursorOutput<BookmarkOutput>
> {
  @Inject(BookmarkRepository)
  private readonly _bookmarkRepository: BookmarkRepository;

  protected async invoke(
    query: GetCollectionBookmarksQuery,
  ): Promise<CursorOutput<BookmarkOutput>> {
    const bookmarks = await this._bookmarkRepository.findByCollection(
      query.collectionId,
    );
    const bookmarksDto = bookmarks.map((bookmark) =>
      BookmarkMapper.toDetailedDto(bookmark),
    );

    return new CursorOutput(
      bookmarksDto,
      bookmarks.at(-1)?.createdAt ?? null,
      bookmarks.length,
    );
  }
}
