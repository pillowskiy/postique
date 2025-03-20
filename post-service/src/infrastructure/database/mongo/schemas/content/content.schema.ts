import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { type HydratedDocument } from 'mongoose';
import { MongoSchema, Schemas } from '../../shared/schema';

export type ContentDocument = HydratedDocument<Content>;

@MongoSchema()
export class Content {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: Schemas.Paragraph,
    required: true,
    default: [],
  })
  paragraphs: string[];
}

export const ContentSchema = SchemaFactory.createForClass(Content);
