import {
  CursorField,
  PreferencesRepository,
} from '@/app/boundaries/repository';
import { OrSpecification } from '@/domain/common/specification';
import { CursorEntity, CursorSupportedField } from '@/domain/cursor';
import { PostEntity } from '@/domain/post';
import { PostPreferencesEntity } from '@/domain/preferences';
import {
  IsBlacklistedPostSpecification,
  IsMutedPostSpecification,
} from '@/domain/preferences/specification';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PostPreferenceFilterService {
  @Inject(PreferencesRepository)
  private readonly _preferencesRepository: PreferencesRepository;

  public async filterPosts<E extends PostEntity = PostEntity>(
    iterator: AsyncIterable<E>,
    field: CursorField,
    userId: string | null,
    limit: number,
  ): Promise<CursorEntity<E>> {
    const pref = await this._getUserPreferences(userId);
    const cursor = new CursorEntity<E>(field as CursorSupportedField<E>);

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

  private async _getUserPreferences(
    userId: string | null,
  ): Promise<
    Pick<PostPreferencesEntity, 'postsBlacklist' | 'authorBlacklist'>
  > {
    if (!userId) {
      return {
        postsBlacklist: new Set(),
        authorBlacklist: new Set(),
      };
    }

    return this._preferencesRepository.preferences(userId);
  }
}
