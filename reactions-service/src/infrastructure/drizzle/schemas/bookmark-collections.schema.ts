import { pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const bookmarkCollections = pgTable(
  'bookmark_collections',
  (t) => ({
    id: t.uuid('id').primaryKey().defaultRandom(),
    userId: t
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: t.varchar('name', { length: 256 }).notNull(),
    description: t.text('description'),

    createdAt: t.timestamp('created_at').notNull().defaultNow(),
    updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
  }),
  (t) => {
    return {
      userNameIdx: uniqueIndex('bookmark_collections_user_name_idx').on(
        t.userId,
        t.name,
      ),
    };
  },
);
