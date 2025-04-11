import { Inject, Injectable } from '@nestjs/common';
import { eq, InferSelectModel } from 'drizzle-orm';
import { PostRepository } from '@/app/boundaries/repository';
import { PostEntity } from '@/domain/post/post.entity';
import { Transactional } from '@/app/boundaries/common';
import { posts } from '@/infrastructure/drizzle/schemas';
import { DrizzleTransactional } from '@/infrastructure/drizzle';

@Injectable()
export class PostgresPostRepository extends PostRepository {
  @Inject(Transactional) private readonly _txHost: DrizzleTransactional;

  async findById(id: string): Promise<PostEntity | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(posts)
      .where(eq(posts.id, id));

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async save(post: PostEntity): Promise<void> {
    await this._txHost.exec
      .insert(posts)
      .values({
        id: post.id,
        title: post.title,
        description: post.description,
        coverImage: post.coverImage,
      })
      .onConflictDoUpdate({
        target: [posts.id],
        set: {
          title: post.title,
          description: post.description,
          coverImage: post.coverImage,
        },
      });
  }

  async delete(postId: string): Promise<void> {
    await this._txHost.exec.delete(posts).where(eq(posts.id, postId));
  }

  #toEntity(result: InferSelectModel<typeof posts>): PostEntity {
    return PostEntity.create({
      id: result.id,
      title: result.title,
      description: result.description!,
      coverImage: result.coverImage,
    });
  }
}
