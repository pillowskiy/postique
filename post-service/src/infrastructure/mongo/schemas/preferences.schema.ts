import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Schemas } from '../common/schema';

export type PostPreferencesDocument = HydratedDocument<PostPreferences>;

@Schema({ id: true, optimisticConcurrency: true, timestamps: true })
export class PostPreferences {
  @Prop({ type: mongoose.Types.ObjectId, ref: Schemas.Users, required: true })
  userId: string;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: Schemas.Posts,
    required: true,
    default: new Set(),
  })
  postsBlacklist: Set<string>;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: Schemas.Users,
    required: true,
    default: new Set(),
  })
  authorBlacklist: Set<string>;
}

export const PostPreferencesSchema =
  SchemaFactory.createForClass(PostPreferences);
