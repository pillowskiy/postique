import { z } from 'zod';
export const CommentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  postId: z.string().uuid(),
  content: z.string().min(2).max(2096),
  createdAt: z.date(),
  updatedAt: z.date(),
  parentId: z.string().uuid().optional(),
});
