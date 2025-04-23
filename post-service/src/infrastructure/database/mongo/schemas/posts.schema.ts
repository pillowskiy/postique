import { PostStatus, PostVisibility } from '@/domain/post';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongoSchema, PropOptimizedUUID, Schemas } from '../shared/schema';

export type PostDocument = HydratedDocument<Post>;

@MongoSchema()
export class Post {
  @PropOptimizedUUID()
  _id: string;

  @Prop({ type: String, required: true, default: '' })
  title: string;

  @Prop({ type: String, required: true, default: '' })
  description: string;

  @Prop({ type: String, default: null })
  coverImage: string | null;

  @Prop({ type: mongoose.Types.UUID, ref: Schemas.Content, required: true })
  content: string;

  @Prop({ type: mongoose.Types.UUID, ref: Schemas.Users, required: true })
  owner: string;

  @Prop({ type: [mongoose.Types.UUID], ref: Schemas.Users, required: true })
  authors: Readonly<string[]>;

  @Prop({ type: String, required: true, unique: true, index: true })
  slug: string;

  @Prop({ type: String, enum: PostStatus, required: true })
  status: PostStatus;

  @Prop({ type: String, enum: PostVisibility, required: true })
  visibility: PostVisibility;

  @Prop({ type: Date, default: null, index: true })
  publishedAt: Date | null;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
