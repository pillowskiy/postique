import { z } from 'zod';

export const PostStatisticSchema = z.object({
  postId: z.string().uuid(),
  liked: z.boolean().default(false),
  saved: z.boolean().default(false),
  collectionId: z.string().uuid().or(z.null()).default(null),
});
