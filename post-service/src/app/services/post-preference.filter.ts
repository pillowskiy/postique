import {
  CursorField,
  PreferencesRepository,
} from '@/app/boundaries/repository';
import { OrSpecification } from '@/domain/common/specification';
import { CursorEntity } from '@/domain/cursor';
import { PostEntity } from '@/domain/post';
import {
  IsBlacklistedPostSpecification,
  IsMutedPostSpecification,
} from '@/domain/preferences/specificaion';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PostPreferenceFilterService {
  @Inject(PreferencesRepository)
  private readonly _preferencesRepository: PreferencesRepository;

  public async filterPosts(
    iterator: AsyncIterable<PostEntity>,
    field: CursorField,
    userId: string,
    limit: number,
  ): Promise<CursorEntity<PostEntity>> {
    const pref = await this._preferencesRepository.preferences(userId);
    const cursor = new CursorEntity<PostEntity>(field);

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
