import { Transactional } from '@/app/boundaries/common';
import { PostStatisticRepository } from '@/app/boundaries/repository';
import { PostStatistic } from '@/domain/post';
import { DrizzleTransactional } from '@/infrastructure/drizzle';
import { bookmarks, likes } from '@/infrastructure/drizzle/schemas';
import { Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';

type PostStats = {
  post_id: string;
  liked: boolean;
  saved: boolean;
  collection_id: string | null;
};

export class PostgresPostStatisticRepository extends PostStatisticRepository {
  @Inject(Transactional) private readonly _txHost: DrizzleTransactional;

  async getUserStatistics(
    userId: string,
    postIds: string[],
  ): Promise<PostStatistic[]> {
    // NOTE: It shouldn't causes sql injection:
    // https://orm.drizzle.team/docs/sql

    const result = await this._txHost.exec.execute<PostStats>(sql`
      SELECT
        pid AS post_id,
        ${likes.createdAt} IS NOT NULL AS liked,
        ${bookmarks.createdAt} IS NOT NULL AS saved,
        ${bookmarks.collectionId}
      FROM unnest(array[${sql.join(
        postIds.map((id) => sql`${id}`),
        sql`, `,
      )}]::uuid[]) AS pid
      LEFT JOIN ${likes} ON ${likes.userId} = ${userId} AND ${likes.targetId} = pid
      LEFT JOIN ${bookmarks} ON ${bookmarks.userId} = ${userId} AND ${bookmarks.targetId} = pid
    `);

    return result.rows.map((r) => this.#toEntity(r));
  }

  #toEntity(result: PostStats): PostStatistic {
    return PostStatistic.create({
      postId: result.post_id,
      liked: result.liked,
      saved: result.saved,
      collectionId: result.collection_id,
    });
  }
}
