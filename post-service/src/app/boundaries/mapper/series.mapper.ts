import { PostSeriesEntity } from '@/domain/series';
import { PostEntity } from '@/domain/post';
import { DetailedSeriesOutput, SeriesOutput } from '../dto/output';
import { PostMapper } from './post.mapper';

export class SeriesMapper {
  static toDto(series: PostSeriesEntity): SeriesOutput {
    return new SeriesOutput(
      series.id,
      series.title,
      series.slug,
      series.owner,
      series.visibility,
      series.description,
    );
  }

  static toDetailedDto(
    series: PostSeriesEntity,
    posts: PostEntity[],
  ): DetailedSeriesOutput {
    return new DetailedSeriesOutput(
      series.id,
      series.title,
      series.slug,
      series.owner,
      series.visibility,
      series.description,
      posts.map((post) => PostMapper.toDto(post)),
    );
  }
}
