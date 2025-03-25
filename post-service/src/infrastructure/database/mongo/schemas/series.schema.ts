import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongoSchema, PropOptimizedUUID, Schemas } from '../shared/schema';

export type PostSeriesDocument = HydratedDocument<PostSeries>;

@MongoSchema()
export class PostSeries {
  @PropOptimizedUUID()
  _id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, unique: true, required: true })
  slug: string;

  @Prop({ type: String, required: true, default: '' })
  description: string;

  @Prop({ type: [mongoose.Types.UUID], ref: Schemas.Posts, required: true })
  posts: Readonly<string[]>;
}

export const PostSeriesSchema = SchemaFactory.createForClass(PostSeries);
