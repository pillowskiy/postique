import { pgTable } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const bookmarkCollections = pgTable('bookmark_collections', (t) => ({
  id: t.uuid('id').primaryKey().defaultRandom(),
  userId: t
    .uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: t.varchar('name', { length: 256 }).notNull(),
  slug: t.varchar('slug', { length: 384 }).notNull().unique(),
  description: t.text('description'),

  createdAt: t.timestamp('created_at').notNull().defaultNow(),
  updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
}));
