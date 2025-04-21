import { z } from 'zod';

export const PostInteractionSchema = z.object({
  postId: z.string().uuid(),
  viewsCount: z.number().min(0).default(0),
  likesCount: z.number().min(0).default(0),
  commentsCount: z.number().min(0).default(0),
  bookmarksCount: z.number().min(0).default(0),
});
