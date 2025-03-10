import { PostStatus, PostVisibility } from '@/domain/enums/post';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Schemas } from '../common/schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ id: true, optimisticConcurrency: true, timestamps: true })
export class Post {
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
}

export const PostSchema = SchemaFactory.createForClass(Post);
