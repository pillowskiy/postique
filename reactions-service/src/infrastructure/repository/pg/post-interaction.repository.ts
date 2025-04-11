import { Inject, Injectable } from '@nestjs/common';
import { eq, InferSelectModel, sql } from 'drizzle-orm';
import { PostInteractionRepository } from '@/app/boundaries/repository';
import { PostInteractionCounts } from '@/domain/post';
import { Transactional } from '@/app/boundaries/common';
import { postsStatistic } from '@/infrastructure/drizzle/schemas';
import { DrizzleTransactional } from '@/infrastructure/drizzle';

@Injectable()
export class PostgresPostInteractionRepository extends PostInteractionRepository {
  @Inject(Transactional) private readonly _txHost: DrizzleTransactional;

  async findByPostId(postId: string): Promise<PostInteractionCounts | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(postsStatistic)
      .where(eq(postsStatistic.postId, postId));

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async save(interaction: PostInteractionCounts): Promise<void> {
    await this._txHost.exec
      .insert(postsStatistic)
      .values({
        postId: interaction.postId,
        likesCount: interaction.likesCount,
        bookmarksCount: interaction.bookmarksCount,
        commentsCount: interaction.commentsCount,
        viewsCount: interaction.viewsCount,
      })
      .onConflictDoUpdate({
        target: [postsStatistic.postId],
        set: {
          likesCount: interaction.likesCount,
          bookmarksCount: interaction.bookmarksCount,
          commentsCount: interaction.commentsCount,
          viewsCount: interaction.viewsCount,
        },
      });
  }

  async updateLikeCount(postId: string, increment: boolean): Promise<void> {
    const newCount = sql`${postsStatistic.likesCount} + ${increment ? 1 : -1}`;
    await this._txHost.exec
      .update(postsStatistic)
      .set({
        likesCount: newCount,
      })
      .where(eq(postsStatistic.postId, postId));
  }

  async updateBookmarkCount(postId: string, increment: boolean): Promise<void> {
    const newCount = sql`${postsStatistic.bookmarksCount} + ${increment ? 1 : -1}`;
    await this._txHost.exec
      .update(postsStatistic)
      .set({
        bookmarksCount: newCount,
      })
      .where(eq(postsStatistic.postId, postId));
  }

  async updateCommentCount(postId: string, increment: boolean): Promise<void> {
    const newCount = sql`${postsStatistic.commentsCount} + ${increment ? 1 : -1}`;
    await this._txHost.exec
      .update(postsStatistic)
      .set({
        commentsCount: newCount,
      })
      .where(eq(postsStatistic.postId, postId));
  }

  async updateViewCount(postId: string): Promise<void> {
    await this._txHost.exec
      .update(postsStatistic)
      .set({
        viewsCount: sql`${postsStatistic.viewsCount} + 1`,
      })
      .where(eq(postsStatistic.postId, postId));
  }

  #toEntity(
    result: InferSelectModel<typeof postsStatistic>,
  ): PostInteractionCounts {
    return PostInteractionCounts.create({
      postId: result.postId,
      likesCount: result.likesCount,
      commentsCount: result.commentsCount,
      viewsCount: result.viewsCount,
      bookmarksCount: result.bookmarksCount,
    });
  }
}
