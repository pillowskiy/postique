import { Inject, Injectable } from '@nestjs/common';
import { eq, InferSelectModel, sql } from 'drizzle-orm';
import { BookmarkCollectionRepository } from '@/app/boundaries/repository';
import {
  BookmarkCollectionAggregate,
  BookmarkCollectionEntity,
} from '@/domain/collection';
import { Transactional } from '@/app/boundaries/common';
import {
  bookmarkCollections,
  bookmarks,
  users,
} from '@/infrastructure/drizzle/schemas';
import { DrizzleTransactional } from '@/infrastructure/drizzle';
import { UserEntity } from '@/domain/user';

@Injectable()
export class PostgresBookmarkCollectionRepository extends BookmarkCollectionRepository {
  @Inject(Transactional) private readonly _txHost: DrizzleTransactional;

  async findById(id: string): Promise<BookmarkCollectionEntity | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(bookmarkCollections)
      .where(eq(bookmarkCollections.id, id));

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async findBySlug(slug: string): Promise<BookmarkCollectionEntity | null> {
    const [result] = await this._txHost.exec
      .select()
      .from(bookmarkCollections)
      .where(eq(bookmarkCollections.slug, slug));

    if (!result) {
      return null;
    }

    return this.#toEntity(result);
  }

  async save(collection: BookmarkCollectionEntity): Promise<void> {
    await this._txHost.exec
      .insert(bookmarkCollections)
      .values({
        id: collection.id,
        userId: collection.userId,
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
      })
      .onConflictDoUpdate({
        target: [bookmarkCollections.id],
        set: {
          name: collection.name,
          description: collection.description,
          updatedAt: collection.updatedAt,
        },
      });
  }

  async delete(collectionId: string): Promise<void> {
    await this._txHost.exec
      .delete(bookmarkCollections)
      .where(eq(bookmarkCollections.id, collectionId));
  }

  async getUserCollections(
    userId: string,
  ): Promise<BookmarkCollectionAggregate[]> {
    const results = await this._txHost.exec
      .select({
        users,
        bookmarkCollections,
        count: sql<number>`COUNT(${bookmarks.id}) AS count`,
      })
      .from(bookmarkCollections)
      .leftJoin(users, eq(users.id, bookmarkCollections.userId))
      .leftJoin(bookmarks, eq(bookmarks.collectionId, bookmarkCollections.id))
      .groupBy(bookmarkCollections.id, users.id)
      .where(eq(bookmarkCollections.userId, userId));

    return results.map((res) => this.#toAggregate(res));
  }

  async getBySlug(slug: string): Promise<BookmarkCollectionAggregate | null> {
    const [result] = await this._txHost.exec
      .select({
        users,
        bookmarkCollections,
        count: sql<number>`COUNT(${bookmarks.id}) AS count`,
      })
      .from(bookmarkCollections)
      .leftJoin(users, eq(users.id, bookmarkCollections.userId))
      .leftJoin(bookmarks, eq(bookmarks.collectionId, bookmarkCollections.id))
      .groupBy(bookmarkCollections.id, users.id)
      .where(eq(bookmarkCollections.slug, slug));

    if (!result) {
      return null;
    }

    return this.#toAggregate(result);
  }

  #toEntity(
    result: InferSelectModel<typeof bookmarkCollections>,
  ): BookmarkCollectionEntity {
    return BookmarkCollectionEntity.create({
      id: result.id,
      userId: result.userId,
      name: result.name,
      slug: result.slug,
      description: result.description ?? '',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  #toAggregate(result: {
    users: InferSelectModel<typeof users> | null;
    bookmarkCollections: InferSelectModel<typeof bookmarkCollections>;
    count: number;
  }): BookmarkCollectionAggregate {
    const aggregate = BookmarkCollectionAggregate.fromEntity(
      this.#toEntity(result.bookmarkCollections),
    );
    aggregate.setBookmarksCount(result.count);

    if (result.users) {
      const user = UserEntity.create({
        id: result.users.id,
        username: result.users.username,
        email: result.users.email,
        avatarPath: result.users.avatarPath ?? '',
      });

      aggregate.setAuthor(user);
    }

    return aggregate;
  }
}
