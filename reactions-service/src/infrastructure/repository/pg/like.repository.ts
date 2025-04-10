import { Inject, Injectable } from '@nestjs/common';
import { and, count, eq, InferSelectModel } from 'drizzle-orm';
import { LikeRepository } from '@/app/boundaries/repository';
import { LikeEntity } from '@/domain/like/like.entity';
import { likes } from '@/infrastructure/drizzle/schemas';
import { DrizzleTransactional } from '@/infrastructure/drizzle';
import { Transactional } from '@/app/boundaries/common';

@Injectable()
export class PostgresLikeRepository extends LikeRepository {
  @Inject(Transactional) private readonly _txHost: DrizzleTransactional;

  async findUserLike(
    userId: string,
    targetId: string,
  ): Promise<LikeEntity | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.targetId, targetId)))
      .limit(1);

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async findByTarget(targetId: string): Promise<LikeEntity[]> {
    const results = await this._txHost.exec
      .select()
      .from(likes)
      .where(eq(likes.targetId, targetId))
      .limit(100);

    return results.map((result) => this.#toEntity(result));
  }

  async findByUser(userId: string): Promise<LikeEntity[]> {
    const results = await this._txHost.exec
      .select()
      .from(likes)
      .where(eq(likes.userId, userId))
      .limit(100);

    return results.map((result) => this.#toEntity(result));
  }

  async save(like: LikeEntity): Promise<void> {
    await this._txHost.exec
      .insert(likes)
      .values({
        userId: like.userId,
        targetId: like.targetId,
        createdAt: like.createdAt,
      })
      .onConflictDoNothing();
  }

  async delete(userId: string, targetId: string): Promise<void> {
    await this._txHost.exec
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.targetId, targetId)));
  }

  async countByTarget(targetId: string): Promise<number> {
    const [result] = await this._txHost.exec
      .select({ count: count() })
      .from(likes)
      .where(eq(likes.targetId, targetId))
      .groupBy(likes.targetId);

    return result?.count ?? 0;
  }

  #toEntity(result: InferSelectModel<typeof likes>): LikeEntity {
    return LikeEntity.create({
      id: `${result.userId}-${result.targetId}`,
      userId: result.userId ?? undefined,
      targetId: result.targetId!,
      createdAt: result.createdAt,
      updatedAt: result.createdAt,
    });
  }
}
