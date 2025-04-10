import { Inject, Injectable } from '@nestjs/common';
import { and, eq, InferSelectModel } from 'drizzle-orm';
import { BookmarkRepository } from '@/app/boundaries/repository';
import { BookmarkEntity } from '@/domain/bookmark/bookmark.entity';
import { Transactional } from '@/app/boundaries/common';
import { bookmarks } from '@/infrastructure/drizzle/schemas';
import { DrizzleTransactional } from '@/infrastructure/drizzle';

@Injectable()
export class PostgresBookmarkRepository extends BookmarkRepository {
  @Inject(Transactional) private readonly _txHost: DrizzleTransactional;

  async findById(id: string): Promise<BookmarkEntity | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.id, id));

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async findByUserAndTarget(
    userId: string,
    targetId: string,
  ): Promise<BookmarkEntity | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(bookmarks)
      .where(
        and(eq(bookmarks.userId, userId), eq(bookmarks.targetId, targetId)),
      );

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async findByUser(userId: string): Promise<BookmarkEntity[]> {
    const results = await this._txHost.exec
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .limit(100);

    return results.map((result) => this.#toEntity(result));
  }

  async findByTarget(targetId: string): Promise<BookmarkEntity[]> {
    const results = await this._txHost.exec
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.targetId, targetId))
      .limit(100);

    return results.map((result) => this.#toEntity(result));
  }

  async save(bookmark: BookmarkEntity): Promise<void> {
    await this._txHost.exec
      .insert(bookmarks)
      .values({
        id: bookmark.id,
        userId: bookmark.userId,
        targetId: bookmark.targetId,
        collectionId: bookmark.collectionId,
        createdAt: bookmark.createdAt,
        updatedAt: bookmark.updatedAt,
      })
      .onConflictDoUpdate({
        target: [bookmarks.id],
        set: {
          collectionId: bookmark.collectionId,
          updatedAt: bookmark.updatedAt,
        },
      });
  }

  async delete(bookmarkId: string): Promise<void> {
    await this._txHost.exec
      .delete(bookmarks)
      .where(eq(bookmarks.id, bookmarkId));
  }

  #toEntity(result: InferSelectModel<typeof bookmarks>): BookmarkEntity {
    return BookmarkEntity.create({
      id: result.id,
      userId: result.userId,
      targetId: result.targetId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      collectionId: result.collectionId ?? undefined,
    });
  }
}
