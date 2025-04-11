import { pgTable, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core';
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
      userTargetIdx: uniqueIndex('likes_user_target_idx').on(
        t.userId,
        t.targetId,
      ),
      targetIdIdx: uniqueIndex('likes_target_id_idx').on(t.targetId),
      userIdIdx: uniqueIndex('likes_user_id_idx').on(t.userId),
      createdAtIdx: uniqueIndex('likes_created_at_idx').on(t.createdAt),
      compositeUniqueIdx: primaryKey({ columns: [t.targetId, t.userId] }),
    };
  },
);
