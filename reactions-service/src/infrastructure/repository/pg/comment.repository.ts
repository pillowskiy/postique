import { Transactional } from '@/app/boundaries/common';
import { CommentRepository } from '@/app/boundaries/repository';
import { CommentAggregate } from '@/domain/comment/comment.aggregate';
import { CommentEntity } from '@/domain/comment/comment.entity';
import { UserEntity } from '@/domain/user';
import { DrizzleTransactional } from '@/infrastructure/drizzle';
import { comments, users } from '@/infrastructure/drizzle/schemas';
import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  eq,
  gt,
  isNull,
  sql,
  type InferSelectModel,
} from 'drizzle-orm';

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

  async findByPost(
    postId: string,
    cursor?: string,
    pageSize: number = 30,
  ): Promise<CommentAggregate[]> {
    const countSubquery = sql<number>`(
      SELECT COUNT(1) 
      FROM ${comments} AS c2 
      WHERE c2.parent_id = ${comments.id}
    )`;

    const results = await this._txHost.exec
      .select({ comments, users, repliesCount: countSubquery })
      .from(comments)
      .where(
        and(
          eq(comments.postId, postId),
          isNull(comments.parentId),
          cursor ? gt(comments.createdAt, new Date(cursor)) : undefined,
        ),
      )
      .leftJoin(users, eq(comments.userId, users.id))
      .limit(pageSize);

    return results.map((result) =>
      this.#toAggregate(result, result.repliesCount),
    );
  }

  async findByParent(
    parentId: string,
    cursor?: string,
    pageSize: number = 30,
  ): Promise<CommentAggregate[]> {
    const results = await this._txHost.exec
      .select({ comments, users })
      .from(comments)
      .where(
        and(
          eq(comments.parentId, parentId),
          cursor ? gt(comments.createdAt, new Date(cursor)) : undefined,
        ),
      )
      .leftJoin(users, eq(comments.userId, users.id))
      .limit(pageSize);

    return results.map((result) => this.#toAggregate(result));
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
    await this._txHost.exec.delete(comments).where(eq(comments.id, commentId));
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

  // TEMP: It might be a good temporary read model.
  #toAggregate(
    result: {
      comments: InferSelectModel<typeof comments>;
      users: InferSelectModel<typeof users> | null;
    },
    repliesCount = 0,
  ): CommentAggregate {
    const comment = CommentAggregate.fromEntity(
      this.#toEntity(result.comments),
    );

    comment.setRepliesCount(repliesCount);
    const user = result.users;
    if (user) {
      comment.setAuthor(
        UserEntity.create({
          id: user.id,
          username: user.username,
          avatarPath: user.avatarPath ?? '',
          email: user.email,
        }),
      );
    }
    return comment;
  }
}
