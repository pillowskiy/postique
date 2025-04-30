import { randomUUID } from 'crypto';
import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.string().uuid().default(randomUUID),
  userId: z.string().uuid(),
  postId: z.string().uuid(),
  content: z.string().min(2).max(2096),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  parentId: z.string().uuid().optional(),
});
