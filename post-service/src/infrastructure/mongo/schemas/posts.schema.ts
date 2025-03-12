import { PostStatus, PostVisibility } from '@/domain/post';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongoSchema, Schemas } from '../common/schema';

export type PostDocument = HydratedDocument<Post>;

@MongoSchema()
export class Post {
  id: mongoose.Types.ObjectId;

  @Prop({ type: String, default: null })
  coverImage: string | null;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true, default: '' })
  description: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Date, default: null })
  editedAt: Date | null;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: [mongoose.Types.ObjectId], ref: Schemas.Users, required: true })
  authors: string[];

  @Prop({ type: String, required: true, unique: true, index: true })
  slug: string;

  @Prop({ type: String, enum: PostStatus, required: true })
  status: PostStatus;

  @Prop({ type: String, enum: PostVisibility, required: true })
  visibility: PostVisibility;

  @Prop({ type: Date, default: null })
  publishedAt: Date | null;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
