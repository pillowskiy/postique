import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, InferSelectModel, SQLWrapper } from 'drizzle-orm';
import { BookmarkRepository } from '@/app/boundaries/repository';
import { BookmarkEntity } from '@/domain/bookmark/bookmark.entity';
import { Transactional } from '@/app/boundaries/common';
import { bookmarks, posts } from '@/infrastructure/drizzle/schemas';
import { DrizzleTransactional } from '@/infrastructure/drizzle';
import { BookmarkAggregate } from '@/domain/bookmark/bookmark.aggregate';
import { PostEntity } from '@/domain/post/post.entity';

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

  async findUserBookmark(
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

  async findByUser(
    userId: string,
    cursor?: string,
    pageSize: number = 50,
  ): Promise<BookmarkAggregate[]> {
    return this.#findAsReadModelByCursor(
      [eq(bookmarks.userId, userId)],
      cursor,
      pageSize,
    );
  }

  async findByCollection(
    collectionId: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<BookmarkAggregate[]> {
    return this.#findAsReadModelByCursor(
      [eq(bookmarks.collectionId, collectionId)],
      cursor,
      pageSize,
    );
  }

  async #findAsReadModelByCursor(
    conditions: SQLWrapper[],
    cursor?: string,
    pageSize: number = 50,
  ): Promise<BookmarkAggregate[]> {
    const results = await this._txHost.exec
      .select()
      .from(bookmarks)
      .where(
        cursor
          ? and(...conditions, gt(bookmarks.createdAt, new Date(cursor)))
          : undefined,
      )
      .leftJoin(posts, eq(bookmarks.targetId, posts.id))
      .limit(pageSize);

    return results.map((result) => this.#toAggregate(result));
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

  #toAggregate(result: {
    bookmarks: InferSelectModel<typeof bookmarks>;
    posts: InferSelectModel<typeof posts> | null;
  }): BookmarkAggregate {
    const bookmark = BookmarkAggregate.fromEntity(
      this.#toEntity(result.bookmarks),
    );

    const post = result.posts;
    if (post) {
      bookmark.setPost(
        PostEntity.create({
          id: post.id,
          title: post.title,
          description: post.description!,
          coverImage: post.coverImage,
        }),
      );
    }
    return bookmark;
  }
}
