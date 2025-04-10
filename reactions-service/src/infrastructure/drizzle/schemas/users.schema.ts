import { pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', (t) => ({
  id: t.uuid('id').primaryKey().defaultRandom(),
  username: t.varchar('username', { length: 100 }).notNull().unique(),
  email: t.varchar('email', { length: 255 }).notNull().unique(),
  avatarPath: t.varchar('avatar_path', { length: 255 }),
  createdAt: t.timestamp('created_at').notNull().defaultNow(),
}));
