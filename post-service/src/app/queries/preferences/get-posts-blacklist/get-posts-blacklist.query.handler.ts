import { QueryHandler } from '@nestjs/cqrs';
import { Query } from '../../common';
import { Inject } from '@nestjs/common';
import {
  PostRepository,
  PreferencesRepository,
} from '@/app/boundaries/repository';
import { PaginatedOutput } from '@/app/boundaries/dto/output/paginated.dto';
import { DetailedPostOutput } from '@/app/boundaries/dto/output';
import { GetPostsBlacklistQuery } from './get-posts-blacklist.query';
import { PostMapper } from '@/app/boundaries/mapper';
import { ArrayUtils } from '@/utils/array';

@QueryHandler(GetPostsBlacklistQuery)
export class GetPostsBlacklistQueryHandler extends Query<
  GetPostsBlacklistQuery,
  PaginatedOutput<DetailedPostOutput>
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(PreferencesRepository)
  private readonly _preferencesRepository: PreferencesRepository;

  protected async invoke(
    input: GetPostsBlacklistQuery,
  ): Promise<PaginatedOutput<DetailedPostOutput>> {
    const pref = await this._preferencesRepository.preferences(input.userId);

    if (!pref) {
      return PaginatedOutput.empty<DetailedPostOutput>();
    }

    const postsBlacklist = ArrayUtils.fromSetWithOffset(
      pref.postsBlacklist,
      input.skip,
      input.take,
    );
    const postIterator = this._postRepository.findManyPosts(postsBlacklist);
    const postsOutput: DetailedPostOutput[] = [];
    for await (const post of postIterator) {
      postsOutput.push(PostMapper.toDetailedDto(post));
    }

    const count = pref.postsBlacklist.size;
    const page = Math.floor(count / input.take) + 1;

    return new PaginatedOutput(postsOutput, count, page);
  }
}
