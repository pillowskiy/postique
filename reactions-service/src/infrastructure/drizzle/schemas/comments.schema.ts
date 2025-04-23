import { index, pgTable } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { posts } from './posts.schema';

export const comments = pgTable(
  'comments',
  (t) => ({
    id: t.uuid('id').primaryKey().defaultRandom(),
    userId: t
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    postId: t
      .uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    parentId: t
      .uuid('parent_id')
      .references(() => comments.id, { onDelete: 'cascade' }),
    content: t.text('content').notNull(),
    isDeleted: t.boolean('is_deleted').notNull().default(false),
    createdAt: t.timestamp('created_at').notNull().defaultNow(),
    updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
  }),
  (t) => {
    return {
      postTimeIdx: index('comments_post_time_idx').on(t.postId, t.createdAt),
      createdAtIdx: index('comments_created_at_idx').on(t.createdAt),
    };
  },
);
