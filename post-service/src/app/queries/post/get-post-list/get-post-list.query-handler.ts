import { Query } from '../../common';
import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostRepository } from '@/app/boundaries/repository';
import { GetPostListQuery } from './get-post-list.query';
import { PostEntity } from '@/domain/post';
import { PostPreferencesEntity } from '@/domain/preferences';
import {
  IsBlacklistedPostSpecification,
  IsMutedPostSpecification,
} from '@/domain/preferences/specificaion';
import { OrSpecification } from '@/domain/common/specification';
import { PreferencesRepository } from '@/app/boundaries/repository/preferences.repository';
import { CursorMapper, PostMapper } from '@/app/boundaries/mapper';
import { CursorOutput, PostOutput } from '@/app/boundaries/dto/output';
import { CursorEntity } from '@/domain/cursor';

@QueryHandler(GetPostListQuery)
export class GetPostListQueryHandler extends Query<
  GetPostListQuery,
  CursorOutput<PostOutput>
> {
  private readonly _cursorField = 'createdAt';
  private readonly _defaultSortField = 'createdAt';

  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(PreferencesRepository)
  private readonly _preferencesRepository: PreferencesRepository;

  protected async invoke(
    input: GetPostListQuery,
  ): Promise<CursorOutput<PostOutput>> {
    const pointer: Date | string = input.cursor ?? new Date();

    const postIterator = this._postRepository.cursor(
      this._cursorField,
      this._defaultSortField,
      pointer,
    );

    const preferences = await this._preferencesRepository.preferences(
      input.userId,
    );

    const cursor = await this._filterPosts(
      postIterator,
      preferences,
      input.take,
    );

    return CursorMapper.toDto(cursor, PostMapper);
  }

  private async _filterPosts(
    iterator: AsyncIterable<PostEntity>,
    pref: PostPreferencesEntity,
    limit: number,
  ): Promise<CursorEntity<PostEntity>> {
    const cursor = new CursorEntity<PostEntity>(this._cursorField);

    const mutedSpec = new IsMutedPostSpecification(pref.authorBlacklist);
    const blacklistedSpec = new IsBlacklistedPostSpecification(
      pref.postsBlacklist,
    );

    const hiddenPostsSpec = new OrSpecification(mutedSpec, blacklistedSpec);

    for await (const post of iterator) {
      if (cursor.size >= limit) {
        break;
      }

      if (hiddenPostsSpec.isSatisfiedBy(post)) {
        continue;
      }

      cursor.append(post);
    }

    return cursor;
  }
}
