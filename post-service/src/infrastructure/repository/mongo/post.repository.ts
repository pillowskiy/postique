import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@/app/boundaries/common';
import {
  CursorField,
  PostRepository,
  SortField,
} from '@/app/boundaries/repository';
import {
  IPost,
  PostAggregate,
  PostEntity,
  PostStatus,
  PostVisibility,
} from '@/domain/post';
import {
  InjectModel,
  MongoTransactional,
  Schemas,
  models,
} from '@/infrastructure/database/mongo';
import { Post, User } from '@/infrastructure/database/mongo/schemas';
import { FilterQuery } from 'mongoose';
import { UserEntity } from '@/domain/user';

@Injectable()
export class MongoPostRepository extends PostRepository {
  @InjectModel(Schemas.Posts) private readonly _postModel: models.PostModel;

  @Inject(Transactional)
  private readonly _transactional: MongoTransactional;

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
            coverImage: post.coverImage,
          } satisfies Post,
        },
        {
          upsert: true,
          session: this._transactional.getSession(undefined),
        },
      )
      .lean();
  }

  async getBySlug(slug: string): Promise<PostEntity | null> {
    const post = await this._postModel
      .findOne({ slug })
      .session(this._transactional.getSession(null))
      .lean();
    if (!post) {
      return null;
    }
    return this.#getPostEntity(post);
  }

  async getById(id: string): Promise<PostEntity | null> {
    const post = await this._postModel
      .findOne({ _id: id })
      .session(this._transactional.getSession(null))
      .lean();
    if (!post) {
      return null;
    }
    return this.#getPostEntity(post);
  }

  async delete(postId: string): Promise<boolean> {
    const query = await this._postModel
      .deleteOne({ _id: postId })
      .session(this._transactional.getSession(null));
    if (!query.acknowledged) {
      throw new Error('Could not delete post');
    }
    return query.deletedCount === 1;
  }

  async loadBySlug(slug: string): Promise<PostAggregate | null> {
    const post = await this._postModel
      .findOne({ slug })
      .session(this._transactional.getSession(null))
      .populate<{ owner: User }>('owner')
      .lean();

    if (!post) {
      return null;
    }

    return this.#getPostAggregate(post);
  }

  async getAllUserPosts(
    userId: string,
    status: PostStatus,
    sortField: SortField,
    take: number,
    skip: number,
  ): Promise<PostAggregate[]> {
    const posts = await this._postModel
      .find({
        authors: userId,
        status,
      })
      .sort({ [sortField]: -1 })
      .limit(take)
      .skip(skip)
      .populate<{ owner: User }>('owner')
      .session(this._transactional.getSession(null))
      .lean();

    return posts.map((post) => this.#getPostAggregate(post));
  }

  async getUserPosts(
    userId: string,
    sortField: SortField,
    take: number,
    skip: number,
  ): Promise<PostAggregate[]> {
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
      .sort({ [sortField]: -1 })
      .limit(take)
      .skip(skip)
      .populate<{ owner: User }>('owner')
      .session(this._transactional.getSession(null))
      .lean();

    return posts.map((post) => this.#getPostAggregate(post));
  }

  cursor(
    field: CursorField,
    sortBy: SortField,
    cursor: string | Date,
  ): AsyncGenerator<PostAggregate> {
    return this._cursor(
      {
        [field]: { $lt: cursor },
      },
      sortBy,
      {
        visibility: PostVisibility.Public,
        status: PostStatus.Published,
        publishedAt: { $exists: true },
      },
    );
  }

  cursorFromList(
    postIds: string[],
    field: CursorField,
    sortBy: SortField,
    cursor: string | Date,
  ): AsyncGenerator<PostAggregate> {
    return this._cursor(
      {
        [field]: { $lt: cursor },
      },
      sortBy,
      {
        _id: { $in: postIds },
        $or: [
          { visibility: PostVisibility.Public },
          {
            visibility: PostVisibility.Premium,
          },
        ],
        status: PostStatus.Published,
        publishedAt: { $exists: true },
      },
    );
  }

  findManyPosts(ids: string[]): AsyncGenerator<PostAggregate> {
    return this._cursor({}, 'createdAt', { _id: { $in: ids } });
  }

  private async *_cursor(
    cursorFilter: Partial<FilterQuery<Post>>,
    sortBy: SortField,
    filter: FilterQuery<Post>,
  ): AsyncGenerator<PostAggregate> {
    const dataCursor = this._postModel
      .find({
        ...filter,
        ...cursorFilter,
      })
      .sort({ [sortBy]: -1 })
      .session(this._transactional.getSession(null))
      .populate<{ owner: User }>('owner')
      .batchSize(100)
      .lean()
      .cursor();

    for await (const doc of dataCursor) {
      yield this.#getPostAggregate(doc);
    }
  }

  #getPostAggregate(
    post: Omit<Post, 'owner'> & { owner: User },
  ): PostAggregate {
    const agg = PostAggregate.create({
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      coverImage: post.coverImage ?? '',
      owner: post.owner._id,
      slug: post.slug,
      authors: [...post.authors],
      status: post.status,
      visibility: post.visibility,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt ?? new Date(),
    });

    const owner = UserEntity.create({
      id: post.owner._id,
      username: post.owner.username,
      email: post.owner.email,
      avatarPath: post.owner.avatarPath,
    });

    agg.setOwner(owner);
    return agg;
  }

  #getPostEntity(post: Post): PostEntity {
    const postAggregate = PostEntity.create({
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      coverImage: post.coverImage ?? '',
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
