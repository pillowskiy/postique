import { randomUUID } from 'crypto';
import { z } from 'zod';

export const BookmarkCollectionSchema = z.object({
  id: z.string().uuid().default(randomUUID),
  userId: z.string().uuid(),
  name: z.string().min(1).max(256),
  slug: z.string().min(1).max(384),
  description: z.string().max(1024).optional().default(''),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});
