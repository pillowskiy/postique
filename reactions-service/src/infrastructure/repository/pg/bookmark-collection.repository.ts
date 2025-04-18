import { Inject, Injectable } from '@nestjs/common';
import { count, eq, InferSelectModel, sql } from 'drizzle-orm';
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

  async findByUser(userId: string): Promise<BookmarkCollectionAggregate[]> {
    const results = await this._txHost.exec
      .select({
        users,
        bookmarkCollections,
        count: sql<number>`COUNT(bookmarks.id) AS count`,
      })
      .from(bookmarkCollections)
      .leftJoin(users, eq(users.id, bookmarkCollections.userId))
      .leftJoin(bookmarks, eq(bookmarks.collectionId, bookmarkCollections.id))
      .groupBy(bookmarkCollections.id)
      .where(eq(bookmarkCollections.userId, userId));

    // @ts-ignore
    return results.map((res) => this.#toAggregate(res));
  }

  async save(collection: BookmarkCollectionEntity): Promise<void> {
    await this._txHost.exec
      .insert(bookmarkCollections)
      .values({
        id: collection.id,
        userId: collection.userId,
        name: collection.name,
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

  #toEntity(
    result: InferSelectModel<typeof bookmarkCollections>,
  ): BookmarkCollectionEntity {
    return BookmarkCollectionEntity.create({
      id: result.id,
      userId: result.userId,
      name: result.name,
      description: result.description ?? '',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  #toAggregate(result: {
    users: InferSelectModel<typeof users> | null;
    bookmarkColletions: InferSelectModel<typeof bookmarkCollections>;
    count: number;
  }): BookmarkCollectionAggregate {
    const aggregate = BookmarkCollectionAggregate.fromEntity(
      this.#toEntity(result.bookmarkColletions),
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
