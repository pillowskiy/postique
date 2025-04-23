import { index, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { posts } from './posts.schema';

export const likes = pgTable(
  'likes',
  (t) => ({
    userId: t
      .uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' }),
    targetId: t.uuid('target_id').references(() => posts.id, {
      onDelete: 'cascade',
    }),

    createdAt: t.timestamp('created_at').notNull().defaultNow(),
  }),
  (t) => {
    return {
      createdAtIdx: index('likes_created_at_idx').on(t.createdAt),
      compositeUniqueIdx: primaryKey({
        columns: [t.targetId, t.userId],
      }),
    };
  },
);
