import { randomUUID } from 'crypto';
import { z } from 'zod';

export const ReactionSchema = z.object({
  id: z.string().uuid().default(randomUUID),
  userId: z.string().uuid(),
  targetId: z.string().uuid(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});
