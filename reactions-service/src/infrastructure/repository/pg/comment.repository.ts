import { Transactional } from '@/app/boundaries/common';
import { CommentRepository } from '@/app/boundaries/repository';
import { CommentEntity } from '@/domain/comment/comment.entity';
import { DrizzleTransactional } from '@/infrastructure/drizzle';
import { comments } from '@/infrastructure/drizzle/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { count, eq, InferSelectModel } from 'drizzle-orm';

@Injectable()
export class PostgresCommentRepository extends CommentRepository {
  @Inject(Transactional) private readonly _txHost: DrizzleTransactional;

  async findById(id: string): Promise<CommentEntity | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(comments)
      .where(eq(comments.id, id));

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async findByPost(postId: string): Promise<CommentEntity[]> {
    const results = await this._txHost.exec
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .limit(100);

    return results.map((result) => this.#toEntity(result));
  }

  async findByParent(parentId: string): Promise<CommentEntity[]> {
    const results = await this._txHost.exec
      .select()
      .from(comments)
      .where(eq(comments.parentId, parentId))
      .limit(100);

    return results.map((result) => this.#toEntity(result));
  }

  async findByUser(userId: string): Promise<CommentEntity[]> {
    const results = await this._txHost.exec
      .select()
      .from(comments)
      .where(eq(comments.userId, userId))
      .limit(100);

    return results.map((result) => this.#toEntity(result));
  }

  async save(comment: CommentEntity): Promise<void> {
    await this._txHost.exec
      .insert(comments)
      .values({
        id: comment.id,
        userId: comment.userId,
        postId: comment.postId,
        content: comment.content,
        parentId: comment.parentId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        isDeleted: false,
      })
      .onConflictDoUpdate({
        target: [comments.id],
        set: {
          content: comment.content,
          updatedAt: comment.updatedAt,
        },
      });
  }

  async delete(commentId: string): Promise<void> {
    await this._txHost.exec
      .update(comments)
      .set({ isDeleted: true })
      .where(eq(comments.id, commentId));
  }

  async countByPost(postId: string): Promise<number> {
    const [result] = await this._txHost.exec
      .select({ count: count() })
      .from(comments)
      .where(eq(comments.postId, postId))
      .groupBy(comments.postId);
    return result.count;
  }

  #toEntity(result: InferSelectModel<typeof comments>): CommentEntity {
    return CommentEntity.create({
      id: result.id,
      userId: result.userId,
      postId: result.postId,
      content: result.content,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      parentId: result.parentId ?? undefined,
    });
  }
}
