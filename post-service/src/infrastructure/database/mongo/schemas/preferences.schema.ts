import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongoSchema, PropOptimizedUUID, Schemas } from '../shared/schema';

export type PostPreferencesDocument = HydratedDocument<PostPreferences>;

@MongoSchema()
export class PostPreferences {
  @PropOptimizedUUID()
  _id: string;

  @Prop({ type: mongoose.Types.UUID, ref: Schemas.Users, required: true })
  userId: string;

  @Prop({
    type: [mongoose.Types.UUID],
    ref: Schemas.Posts,
    required: true,
    default: [],
  })
  postsBlacklist: string[];

  @Prop({
    type: [mongoose.Types.UUID],
    ref: Schemas.Users,
    required: true,
    default: [],
  })
  authorBlacklist: string[];
}

export const PostPreferencesSchema =
  SchemaFactory.createForClass(PostPreferences);
