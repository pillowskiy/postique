import { QueryHandler } from '@nestjs/cqrs';
import { GetDetailedSeriesQuery } from './get-detailed.query';
import { Query } from '../../common';
import { DetailedSeriesOutput } from '@/app/boundaries/dto/output';
import { Inject } from '@nestjs/common';
import { PostRepository, SeriesRepository } from '@/app/boundaries/repository';
import { PostPreferenceFilterService } from '@/app/services';
import { NotFoundException } from '@/app/boundaries/errors';
import { SeriesMapper } from '@/app/boundaries/mapper';
import { PostEntity } from '@/domain/post';

@QueryHandler(GetDetailedSeriesQuery)
export class GetDetailedSeriesQueryHandler extends Query<
  GetDetailedSeriesQuery,
  DetailedSeriesOutput
> {
  // It is very unlikely to exceed the maximum number of visible posts,
  // but in the future, we may need to increase this limit or implement paginated output.
  private readonly MAX_VISIBLE_POSTS = 250;
  private readonly _cursorField = 'createdAt';
  private readonly _sortField = 'createdAt';

  @Inject(SeriesRepository)
  private readonly _seriesRepository: SeriesRepository;

  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(PostPreferenceFilterService)
  private readonly _filterService: PostPreferenceFilterService;

  protected async invoke(
    input: GetDetailedSeriesQuery,
  ): Promise<DetailedSeriesOutput> {
    const series = await this._seriesRepository.getBySlug(input.slug);
    if (!series) {
      throw new NotFoundException('Series does not exist');
    }

    const postIterator = this._postRepository.cursorFromList(
      [...series.posts],
      this._cursorField,
      this._sortField,
      new Date(),
    );

    const items: PostEntity[] = [];

    if (input.initiatedBy) {
      const cursor = await this._filterService.filterPosts(
        postIterator,
        this._cursorField,
        input.initiatedBy,
        this.MAX_VISIBLE_POSTS,
      );
      items.concat(cursor.items);
    } else {
      for await (const post of postIterator) {
        items.push(post);
      }
    }

    return SeriesMapper.toDetailedDto(series, items);
  }
}
