import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongoSchema, Schemas } from '../common/schema';

export type PostPreferencesDocument = HydratedDocument<PostPreferences>;

@MongoSchema()
export class PostPreferences {
  @Prop({ type: mongoose.Types.ObjectId, ref: Schemas.Users, required: true })
  userId: string;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: Schemas.Posts,
    required: true,
    default: [],
  })
  postsBlacklist: string[];

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: Schemas.Users,
    required: true,
    default: [],
  })
  authorBlacklist: string[];
}

export const PostPreferencesSchema =
  SchemaFactory.createForClass(PostPreferences);
