import { Query } from '../../common';
import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostRepository } from '@/app/boundaries/repository';
import { GetPostListQuery } from './get-post-list.query';
import { CursorMapper, PostMapper } from '@/app/boundaries/mapper';
import { CursorOutput, DetailedPostOutput } from '@/app/boundaries/dto/output';
import { PostPreferenceFilterService } from '@/app/services';
import { PostAggregate } from '@/domain/post';

@QueryHandler(GetPostListQuery)
export class GetPostListQueryHandler extends Query<
  GetPostListQuery,
  CursorOutput<DetailedPostOutput>
> {
  private readonly _cursorField = 'createdAt';
  private readonly _defaultSortField = 'createdAt';

  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(PostPreferenceFilterService)
  private readonly _filterService: PostPreferenceFilterService;

  protected async invoke(
    input: GetPostListQuery,
  ): Promise<CursorOutput<DetailedPostOutput>> {
    const pointer: Date | string = input.cursor ?? new Date();

    const postIterator = this._postRepository.cursor(
      this._cursorField,
      this._defaultSortField,
      pointer,
    );

    const cursor = await this._filterService.filterPosts<PostAggregate>(
      postIterator,
      this._cursorField,
      input.userId,
      input.take,
    );

    return CursorMapper.toDetailedDto(cursor, PostMapper);
  }
}
