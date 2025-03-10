import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Schemas } from '../common/schema';

export type PostSeriesDocument = HydratedDocument<PostSeries>;

@Schema({ id: true, optimisticConcurrency: true, timestamps: true })
export class PostSeries {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true, default: '' })
  description: string;

  @Prop({ type: [mongoose.Types.ObjectId], ref: Schemas.Posts, required: true })
  posts: string[];
}

export const PostSeriesSchema = SchemaFactory.createForClass(PostSeries);
