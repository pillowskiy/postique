import { QueryHandler } from '@nestjs/cqrs';
import { GetWatchlistQuery } from './get-watchlist.query';
import { Query } from '../../common';
import { BookmarkOutput, CursorOutput } from '@/app/boundaries/dto/output';
import { Inject } from '@nestjs/common';
import { BookmarkAccessControlList } from '@/app/boundaries/acl';
import { BookmarkRepository } from '@/app/boundaries/repository';
import { ForbiddenException } from '@/app/boundaries/errors';
import { BookmarkMapper } from '@/app/boundaries/mapper';

@QueryHandler(GetWatchlistQuery)
export class GetWatchlistQueryHandler extends Query<
  GetWatchlistQuery,
  CursorOutput<BookmarkOutput>
> {
  @Inject(BookmarkAccessControlList)
  private readonly _bookmarkACL: BookmarkAccessControlList;

  @Inject(BookmarkRepository)
  private readonly _bookmarkRepository: BookmarkRepository;

  protected async invoke(
    query: GetWatchlistQuery,
  ): Promise<CursorOutput<BookmarkOutput>> {
    const canView = await this._bookmarkACL.canView(
      query.requestedBy,
      query.userId,
    );

    if (!canView) {
      throw new ForbiddenException(
        'You do not have permission to view these bookmarks',
      );
    }

    const bookmarks = await this._bookmarkRepository.findWithoutCollection(
      query.userId,
      query.cursor,
      query.pageSize,
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
