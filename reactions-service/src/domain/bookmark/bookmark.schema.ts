import { z } from 'zod';
import { ReactionSchema } from '../reaction/reaction.schema';

export const BookmarkSchema = ReactionSchema.extend({
  collectionId: z.string().uuid().or(z.null()),
});
