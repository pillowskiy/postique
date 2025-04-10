import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', (t) => ({
  id: t.uuid('id').primaryKey().defaultRandom(),
  title: t.varchar('title', { length: 255 }).notNull(),
  description: t.text('description').notNull().default(''),
  createdAt: t.timestamp('created_at').notNull().defaultNow(),
}));

export const postsStatistic = pgTable('posts_statistic', (t) => ({
  postId: t
    .uuid('post_id')
    .notNull()
    .references(() => posts.id),
  viewsCount: t.integer('views_count').notNull().default(0),
  likesCount: t.integer('likes_count').notNull().default(0),
  commentsCount: t.integer('comments_count').notNull().default(0),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  statistic: one(postsStatistic, {
    fields: [postsStatistic.postId],
    references: [posts.id],
  }),
}));
