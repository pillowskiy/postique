import { z } from 'zod';
import { ReactionSchema } from '../reaction/reaction.schema';

export const ViewSchema = ReactionSchema.extend({
  readPercentage: z.number().min(0).max(1),
  readingTime: z.number().min(0),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
});
