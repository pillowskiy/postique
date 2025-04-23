import { QueryHandler } from '@nestjs/cqrs';
import { FindBatchQuery } from './find-batch.query';
import { Query } from '../../common';
import { Inject } from '@nestjs/common';
import { PostRepository } from '@/app/boundaries/repository';
import { PostPreferenceFilterService } from '@/app/services';
import { DetailedPostOutput } from '@/app/boundaries/dto/output';
import { PostMapper } from '@/app/boundaries/mapper';
import { PostAggregate } from '@/domain/post';

@QueryHandler(FindBatchQuery)
export class FindBatchQueryHandler extends Query<
  FindBatchQuery,
  DetailedPostOutput[]
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(PostPreferenceFilterService)
  private readonly _filterService: PostPreferenceFilterService;

  protected async invoke(input: FindBatchQuery): Promise<DetailedPostOutput[]> {
    const postIterator = this._postRepository.findManyPosts(input.ids);

    const posts = await this._filterService.filterPosts<PostAggregate>(
      postIterator,
      'createdAt',
      input.initiatedBy,
      input.ids.length,
    );

    return posts.items.map((post) => PostMapper.toDetailedDto(post));
  }
}
