import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongoSchema, PropOptimizedUUID, Schemas } from '../shared/schema';

export type ContentDocument = HydratedDocument<Content>;

@MongoSchema()
export class Content {
  @PropOptimizedUUID()
  _id: string;

  @Prop({
    type: [mongoose.Types.UUID],
    ref: Schemas.Paragraph,
    required: true,
    default: [],
  })
  paragraphs: string[];
}

export const ContentSchema = SchemaFactory.createForClass(Content);
