import { PostSeriesEntity } from '@/domain/series';
import { Series } from '../dto/output';

export class SeriesMapper {
  static toDto(series: PostSeriesEntity): Series {
    return new Series(
      series.id,
      series.title,
      series.slug,
      series.owner,
      series.visibility,
      series.description,
      series.posts,
    );
  }
}
