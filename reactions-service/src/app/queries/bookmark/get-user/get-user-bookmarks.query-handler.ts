import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Query } from '../../common';
import { GetUserBookmarksQuery } from './get-user-bookmarks.query';
import { BookmarkRepository } from '@/app/boundaries/repository';
import { BookmarkAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException } from '@/app/boundaries/errors';
import { BookmarkOutput, CursorOutput } from '@/app/boundaries/dto/output';
import { BookmarkMapper } from '@/app/boundaries/mapper';

@QueryHandler(GetUserBookmarksQuery)
export class GetUserBookmarksQueryHandler extends Query<
  GetUserBookmarksQuery,
  CursorOutput<BookmarkOutput>
> {
  @Inject(BookmarkAccessControlList)
  private readonly _bookmarkACL: BookmarkAccessControlList;

  @Inject(BookmarkRepository)
  private readonly _bookmarkRepository: BookmarkRepository;

  protected async invoke(
    query: GetUserBookmarksQuery,
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

    const bookmarks = await this._bookmarkRepository.findByUser(query.userId);
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
