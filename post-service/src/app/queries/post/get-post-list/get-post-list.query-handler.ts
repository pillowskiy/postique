import { Post } from '@/app/boundaries/dto/output';
import { Query } from '../../common';
import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostRepository } from '@/app/boundaries/repository';
import { GetPostListQuery } from './get-post-list.query';
import { Cursor } from '@/app/boundaries/dto/output';
import { PostEntity } from '@/domain/post';
import { PostPreferencesEntity } from '@/domain/preferences';
import {
  IsBlacklistedPostSpecification,
  IsMutedPostSpecification,
} from '@/domain/preferences/specificaion';
import { OrSpecification } from '@/domain/common/specification';
import { PreferencesRepository } from '@/app/boundaries/repository/preferences.repository';
import { PostMapper } from '@/app/boundaries/mapper';

@QueryHandler(GetPostListQuery)
export class GetPostListQueryHandler extends Query<
  GetPostListQuery,
  Cursor<Post>
> {
  private readonly _cursorField = 'createdAt';
  private readonly _defaultSortField = 'createdAt';

  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(PreferencesRepository)
  private readonly _preferencesRepository: PreferencesRepository;

  protected async invoke(input: GetPostListQuery): Promise<Cursor<Post>> {
    const cursor: Date | string = input.cursor ?? new Date();

    const postIterator = this._postRepository.cursor(
      this._cursorField,
      this._defaultSortField,
      cursor,
    );

    const preferences = await this._preferencesRepository.preferences(
      input.userId,
    );

    return this._filterPosts(postIterator, preferences, input.take);
  }

  private async _filterPosts(
    iterator: AsyncIterable<PostEntity>,
    pref: PostPreferencesEntity,
    limit: number,
  ): Promise<Cursor<Post>> {
    const cursor = new Cursor<Post>(this._cursorField);

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

      cursor.append(PostMapper.toDto(post));
    }

    return cursor;
  }
}
