import { PostSeriesEntity } from '@/domain/series';

export abstract class SeriesRepository {
  abstract save(series: PostSeriesEntity): Promise<void>;
  abstract delete(id: string): Promise<boolean>;
  abstract getBySlug(slug: string): Promise<PostSeriesEntity | null>;
  abstract getById(id: string): Promise<PostSeriesEntity | null>;
}
