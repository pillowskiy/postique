import { z } from 'zod';
import { PostStatus, PostVisibility } from './post.enum';

export const PostSchema = z.object({
  id: z.string().uuid().nonempty(),
  title: z.string().min(1),
  description: z.string().default(''),
  coverImage: z.string().optional().or(z.null()),
  visibility: z.nativeEnum(PostVisibility),
  status: z.nativeEnum(PostStatus),
});
