import { PostRepository } from '@/app/boundaries/repository';
import { PostAggregate } from '@/domain/post';
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

  async save(post: PostAggregate): Promise<void> {
    await this._postModel
      .updateOne(
        { _id: post.id },
        {
          $set: {
            title: post.content.title,
            description: post.content.description,
            content: post.content,
            editedAt: post.content.editedAt,
            owner: post.owner,
            authors: post.authors,
            slug: post.slug,
            status: post.status,
            visibility: post.visibility,
            publishedAt: post.publishedAt,
            createdAt: post.createdAt,
          },
        },
        {
          upsert: true,
        },
      )
      .lean();
  }

  async getBySlug(slug: string): Promise<PostAggregate | null> {
    const post = await this._postModel.findOne({ slug }).lean();
    if (!post) {
      return null;
    }
    return this.#getPostAggregate(post);
  }

  async getById(id: string): Promise<PostAggregate | null> {
    const post = await this._postModel.findOne({ _id: id }).lean();
    if (!post) {
      return null;
    }
    return this.#getPostAggregate(post);
  }

  async delete(postId: string): Promise<boolean> {
    const query = await this._postModel.deleteOne({ _id: postId });
    if (!query.acknowledged) {
      throw new Error('Could not delete post');
    }
    return query.deletedCount === 1;
  }

  #getPostAggregate(post: Post): PostAggregate {
    const postAggregate = PostAggregate.create({
      id: post.id.toString(),
      content: {
        title: post.title,
        description: post.description,
        content: post.content,
      },
      owner: post.owner,
      slug: post.slug,
      authors: post.authors,
      status: post.status,
      visibility: post.visibility,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });

    return postAggregate;
  }
}
