import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@/app/boundaries/common';
import { SeriesRepository } from '@/app/boundaries/repository';
import {
  IPostSeries,
  PostSeriesEntity,
  PostSeriesVisibility,
} from '@/domain/series';
import {
  InjectModel,
  models,
  MongoTransactional,
  Schemas,
} from '@/infrastructure/database/mongo';
import { PostSeries } from '@/infrastructure/database/mongo/schemas';
import type { FilterQuery } from 'mongoose';

@Injectable()
export class MongoSeriesRepository extends SeriesRepository {
  @Inject(Transactional)
  private readonly _transactional: MongoTransactional;

  @InjectModel(Schemas.Series)
  private readonly _seriesModel: models.PostSeriesModel;

  async save(series: PostSeriesEntity): Promise<void> {
    await this._seriesModel.updateOne(
      { _id: series.id },
      {
        $set: {
          _id: series.id,
          title: series.title,
          slug: series.slug,
          owner: series.owner,
          visibility: series.visibility,
          description: series.description,
          posts: series.posts,
        } satisfies PostSeries,
      },
      {
        upsert: true,
        session: this._transactional.getSession(undefined),
      },
    );
  }

  async getBySlug(slug: string): Promise<PostSeriesEntity | null> {
    const series = await this._seriesModel
      .findOne({ slug })
      .session(this._transactional.getSession(null))
      .lean();
    if (!series) {
      return null;
    }

    return this.#getSeriesEntity(series);
  }

  async getById(id: string): Promise<PostSeriesEntity | null> {
    const series = await this._seriesModel
      .findById(id)
      .session(this._transactional.getSession(null))
      .lean();
    if (!series) {
      return null;
    }

    return this.#getSeriesEntity(series);
  }

  async delete(id: string): Promise<boolean> {
    const query = await this._seriesModel
      .deleteOne({ _id: id })
      .session(this._transactional.getSession(null));
    if (!query.acknowledged) {
      throw new Error('Could not delete post');
    }
    return query.deletedCount === 1;
  }

  async getPostSerieses(
    postId: string,
    userId: string,
  ): Promise<PostSeriesEntity[]> {
    // TEMP: It is not responsibility of the infrastructure layer.
    // Transition to cursor (async iterable) and application layer specification.
    const orCondition: FilterQuery<PostSeries>[] = [
      { visibility: PostSeriesVisibility.Public },
    ];

    if (userId) {
      orCondition.push({
        visibility: PostSeriesVisibility.Private,
        owner: userId,
      });
    }

    const serieses = await this._seriesModel
      .find({
        posts: { $has: postId },
        $or: orCondition,
      })
      .session(this._transactional.getSession(null))
      .lean();

    return serieses.map((series) => this.#getSeriesEntity(series));
  }

  async getUserSerieses(
    userId: string,
    take: number,
    skip: number,
  ): Promise<PostSeriesEntity[]> {
    const serieses = await this._seriesModel
      .find({
        owner: userId,
        visibility: PostSeriesVisibility.Public,
      })
      .limit(take)
      .skip(skip)
      .session(this._transactional.getSession(null))
      .lean();

    return serieses.map((series) => this.#getSeriesEntity(series));
  }

  #getSeriesEntity(series: PostSeries): PostSeriesEntity {
    const seriesEntity = PostSeriesEntity.create({
      id: series._id.toString(),
      title: series.title,
      owner: series.owner,
      visibility: series.visibility,
      slug: series.slug,
      description: series.description,
      posts: series.posts,
    } satisfies IPostSeries);
    return seriesEntity;
  }
}
