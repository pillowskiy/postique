import { index, pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { bookmarkCollections } from './bookmark-collections.schema';
import { posts } from './posts.schema';

export const bookmarks = pgTable(
  'bookmarks',
  (t) => ({
    id: t.uuid('id').primaryKey().defaultRandom(),
    userId: t
      .uuid('id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    targetId: t
      .uuid('target_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    collectionId: t
      .uuid('collection_id')
      .references(() => bookmarkCollections.id, { onDelete: 'set null' }),

    createdAt: t.timestamp('created_at').notNull().defaultNow(),
    updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
  }),
  (t) => {
    return {
      userTargetIdx: uniqueIndex('bookmarks_user_target_idx').on(
        t.userId,
        t.targetId,
      ),
      collectionIdIdx: index('bookmarks_collection_id_idx').on(t.collectionId),
      createdAtIdx: index('bookmarks_created_at_idx').on(t.createdAt),
    };
  },
);
