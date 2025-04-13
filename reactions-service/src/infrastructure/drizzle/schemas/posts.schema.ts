import { PostStatus, PostVisibility } from '@/domain/post';
import { relations } from 'drizzle-orm';
import { pgEnum, pgTable } from 'drizzle-orm/pg-core';

export const visibilityEnum = pgEnum('visibility', [
  PostVisibility.Public,
  PostVisibility.Private,
  PostVisibility.Unlisted,
  PostVisibility.Subscribers,
  PostVisibility.Premium,
] as [string, ...string[]]);

export const statusEnum = pgEnum('status', [
  PostStatus.Draft,
  PostStatus.Published,
  PostStatus.Archived,
] as [string, ...string[]]);

export const posts = pgTable('posts', (t) => ({
  id: t.uuid('id').primaryKey().defaultRandom(),
  title: t.text('title').notNull(),
  description: t.text('description').default(''),
  coverImage: t.text('cover_image'),
  visibility: visibilityEnum().notNull().default(PostVisibility.Public),
  status: statusEnum().notNull().default(PostStatus.Draft),
}));

export const postsStatistic = pgTable('posts_statistic', (t) => ({
  postId: t
    .uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  viewsCount: t.integer('views_count').notNull().default(0),
  likesCount: t.integer('likes_count').notNull().default(0),
  commentsCount: t.integer('comments_count').notNull().default(0),
  bookmarksCount: t.integer('bookmarks_count').notNull().default(0),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  statistic: one(postsStatistic, {
    fields: [posts.id],
    references: [postsStatistic.postId],
  }),
}));
