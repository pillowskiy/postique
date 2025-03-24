import {
  CursorField,
  PostRepository,
  SortField,
} from '@/app/boundaries/repository';
import { IPost, PostEntity, PostStatus, PostVisibility } from '@/domain/post';
import { InjectModel, Schemas, models } from '@/infrastructure/database/mongo';
import { Post } from '@/infrastructure/database/mongo/schemas';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoPostRepository extends PostRepository {
  constructor(
    @InjectModel(Schemas.Posts) private readonly _postModel: models.PostModel,
  ) {
    super();
  }

  async save(post: PostEntity): Promise<void> {
    await this._postModel
      .updateOne(
        { _id: post.id },
        {
          $set: {
            _id: post.id,
            title: post.title,
            description: post.description,
            owner: post.owner,
            authors: post.authors,
            slug: post.slug,
            content: post.content,
            status: post.status,
            visibility: post.visibility,
            publishedAt: post.publishedAt,
            createdAt: post.createdAt,
            coverImage: null,
          } satisfies Post,
        },
        {
          upsert: true,
          strict: false,
        },
      )
      .lean();
  }

  async getBySlug(slug: string): Promise<PostEntity | null> {
    const post = await this._postModel.findOne({ slug }).lean();
    if (!post) {
      return null;
    }
    return this.#getPostEntity(post);
  }

  async getById(id: string): Promise<PostEntity | null> {
    const post = await this._postModel.findOne({ _id: id }).lean();
    if (!post) {
      return null;
    }
    return this.#getPostEntity(post);
  }

  async delete(postId: string): Promise<boolean> {
    const query = await this._postModel.deleteOne({ _id: postId });
    if (!query.acknowledged) {
      throw new Error('Could not delete post');
    }
    return query.deletedCount === 1;
  }

  async getAllUserPosts(
    userId: string,
    status: PostStatus,
    sortField: SortField,
    take: number,
    skip: number,
  ): Promise<PostEntity[]> {
    const posts = await this._postModel
      .find({
        authors: userId,
        status,
      })
      .sort({ [sortField]: 1 })
      .limit(take)
      .skip(skip)
      .lean();

    return posts.map((post) => this.#getPostEntity(post));
  }

  async getUserPosts(
    userId: string,
    sortField: SortField,
    take: number,
    skip: number,
  ): Promise<PostEntity[]> {
    const posts = await this._postModel
      .find({
        status: PostStatus.Published,
        authors: { $in: [userId] },
        $or: [
          { visibility: PostVisibility.Public },
          {
            visibility: PostVisibility.Premium,
          },
        ],
        publishedAt: { $exists: true },
      })
      .sort({ [sortField]: 1 })
      .limit(take)
      .skip(skip)
      .lean();

    return posts.map((post) => this.#getPostEntity(post));
  }

  async *cursor(
    field: CursorField,
    sortBy: SortField,
    cursor: string | Date,
  ): AsyncGenerator<PostEntity> {
    const dataCursor = this._postModel
      .find({
        [field]: { $lt: cursor },
        $or: [
          { visibility: PostVisibility.Public },
          {
            visibility: PostVisibility.Premium,
          },
        ],
        status: PostStatus.Published,
        publishedAt: { $exists: true },
      })
      .sort({ [sortBy]: 1 })
      .limit(200)
      .cursor();

    for await (const doc of dataCursor) {
      yield this.#getPostEntity(doc);
    }
  }

  #getPostEntity(post: Post): PostEntity {
    const postAggregate = PostEntity.create({
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      owner: post.owner,
      content: post.content,
      slug: post.slug,
      authors: post.authors,
      status: post.status,
      visibility: post.visibility,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt ?? new Date(),
    } satisfies IPost);

    return postAggregate;
  }
}
