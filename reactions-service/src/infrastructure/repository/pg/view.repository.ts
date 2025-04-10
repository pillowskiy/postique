import { Inject, Injectable } from '@nestjs/common';
import { and, eq, avg, count, InferSelectModel } from 'drizzle-orm';
import { ViewRepository } from '@/app/boundaries/repository';
import { ViewEntity } from '@/domain/view/view.entity';
import { Transactional } from '@/app/boundaries/common';
import { views } from '@/infrastructure/drizzle/schemas';
import { DrizzleTransactional } from '@/infrastructure/drizzle';

@Injectable()
export class PostgresViewRepository extends ViewRepository {
  @Inject(Transactional) private readonly _txHost: DrizzleTransactional;

  async findById(id: string): Promise<ViewEntity | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(views)
      .where(eq(views.id, id))
      .limit(1);

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async findByTarget(targetId: string): Promise<ViewEntity[]> {
    const results = await this._txHost.exec
      .select()
      .from(views)
      .where(eq(views.targetId, targetId))
      .limit(100);

    return results.map((result) => this.#toEntity(result));
  }

  async findUserView(
    userId: string,
    targetId: string,
  ): Promise<ViewEntity | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(views)
      .where(and(eq(views.userId, userId), eq(views.targetId, targetId)))
      .limit(1);

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async save(view: ViewEntity): Promise<void> {
    await this._txHost.exec.insert(views).values({
      id: view.id,
      userId: view.isAnonymous() ? null : view.userId,
      targetId: view.targetId,
      readPercentage: view.readPercentage,
      readingTime: view.readingTime,
      referrer: view.referrer,
      userAgent: view.userAgent,
      createdAt: view.createdAt,
    });
  }

  async countByTarget(targetId: string): Promise<number> {
    const [result] = await this._txHost.exec
      .select({ count: count() })
      .from(views)
      .where(eq(views.targetId, targetId))
      .groupBy(views.targetId);

    return result?.count ?? 0;
  }

  async getReadingStatsByTarget(targetId: string): Promise<{
    avgReadPercentage: number;
    avgReadingTime: number;
    totalViews: number;
  }> {
    const [result] = await this._txHost.exec
      .select({
        avgReadPercentage: avg(views.readPercentage),
        avgReadingTime: avg(views.readingTime),
        totalViews: count(),
      })
      .from(views)
      .where(eq(views.targetId, targetId));

    if (!result) {
      return {
        avgReadPercentage: 0,
        avgReadingTime: 0,
        totalViews: 0,
      };
    }

    return {
      avgReadPercentage: +result.avgReadPercentage!,
      avgReadingTime: +result.avgReadingTime!,
      totalViews: result.totalViews,
    };
  }

  #toEntity(result: InferSelectModel<typeof views>): ViewEntity {
    return ViewEntity.create({
      id: result.id,
      userId: result.userId ?? undefined,
      targetId: result.targetId,
      readPercentage: result.readPercentage,
      readingTime: result.readingTime,
      createdAt: result.createdAt,
      referrer: result.referrer ?? undefined,
      userAgent: result.userAgent ?? undefined,
    });
  }
}
