import { QueryHandler } from '@nestjs/cqrs';
import { Query } from '../../common';
import { Inject } from '@nestjs/common';
import {
  PostRepository,
  PreferencesRepository,
} from '@/app/boundaries/repository';
import { Paginated } from '@/app/boundaries/dto/output/paginated.dto';
import { Post } from '@/app/boundaries/dto/output';
import { GetPostsBlacklistQuery } from './get-posts-blacklist.query';
import { PostMapper } from '@/app/boundaries/mapper';
import { ArrayUtils } from '@/utils/array';

@QueryHandler(GetPostsBlacklistQuery)
export class GetPostsBlacklistQueryHandler extends Query<
  GetPostsBlacklistQuery,
  Paginated<Post>
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(PreferencesRepository)
  private readonly _preferencesRepository: PreferencesRepository;

  protected async invoke(
    input: GetPostsBlacklistQuery,
  ): Promise<Paginated<Post>> {
    const pref = await this._preferencesRepository.preferences(input.userId);

    if (!pref) {
      return new Paginated<Post>([], 0, 1);
    }

    const postsBlacklist = ArrayUtils.fromSetWithOffset(
      pref.postsBlacklist,
      input.skip,
      input.take,
    );
    const posts = await this._postRepository.findManyPosts(postsBlacklist);

    const postsOutput = posts.map((post) => PostMapper.toDto(post));
    const count = pref.postsBlacklist.size;
    const page = Math.floor(count / input.take) + 1;

    return new Paginated<Post>(postsOutput, count, page);
  }
}
