import { pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { posts } from './posts.schema';

export const views = pgTable(
  'views',
  (t) => ({
    id: t.uuid('id').primaryKey().defaultRandom(),
    userId: t.uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    targetId: t
      .uuid('target_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    readPercentage: t.integer('read_percentage').notNull().default(0),
    readingTime: t.integer('reading_time').notNull().default(0),
    referrer: t.varchar('referrer', { length: 255 }),
    userAgent: t.varchar('user_agent', { length: 255 }),
    createdAt: t.timestamp('created_at').notNull().defaultNow(),
  }),
  (t) => {
    return {
      targetIdIdx: uniqueIndex('views_target_id_idx').on(t.targetId),
      userIdIdx: uniqueIndex('views_user_id_idx').on(t.userId),
      createdAtIdx: uniqueIndex('views_created_at_idx').on(t.createdAt),
      referrerIdx: uniqueIndex('views_referrer_idx').on(t.referrer),
    };
  },
);
