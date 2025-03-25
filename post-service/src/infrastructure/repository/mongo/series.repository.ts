import { SeriesRepository } from '@/app/boundaries/repository';
import { IPostSeries, PostSeriesEntity } from '@/domain/series';
import { InjectModel, models, Schemas } from '@/infrastructure/database/mongo';
import { PostSeries } from '@/infrastructure/database/mongo/schemas';

export class MongoSeriesRepository extends SeriesRepository {
  constructor(
    @InjectModel(Schemas.Series)
    private readonly _seriesModel: models.PostSeriesModel,
  ) {
    super();
  }

  async save(series: PostSeriesEntity): Promise<void> {
    await this._seriesModel.updateOne(
      { _id: series.id },
      {
        $set: {
          _id: series.id,
          title: series.title,
          slug: series.slug,
          description: series.description,
          posts: series.posts,
        } satisfies PostSeries,
      },
      {
        upsert: true,
      },
    );
  }

  async getBySlug(slug: string): Promise<PostSeriesEntity | null> {
    const series = await this._seriesModel.findOne({ slug }).lean();
    if (!series) {
      return null;
    }

    return this.#getSeriesEntity(series);
  }

  async getById(id: string): Promise<PostSeriesEntity | null> {
    const series = await this._seriesModel.findById(id).lean();
    if (!series) {
      return null;
    }

    return this.#getSeriesEntity(series);
  }

  async delete(id: string): Promise<boolean> {
    const query = await this._seriesModel.deleteOne({ _id: id });
    if (!query.acknowledged) {
      throw new Error('Could not delete post');
    }
    return query.deletedCount === 1;
  }

  #getSeriesEntity(series: PostSeries): PostSeriesEntity {
    const seriesEntity = PostSeriesEntity.create({
      id: series._id.toString(),
      title: series.title,
      slug: series.slug,
      description: series.description,
      posts: series.posts,
    } satisfies IPostSeries);
    return seriesEntity;
  }
}
