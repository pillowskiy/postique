import { PostSeriesEntity } from '@/domain/series';
import { SeriesOutput } from '../dto/output';

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
}
