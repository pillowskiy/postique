import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongoSchema, Schemas } from '../../shared/schema';

export type ParagraphDocument = HydratedDocument<Paragraph>;

@MongoSchema()
export class Paragraph {
  _id: string;

  @Prop({ type: String, required: true })
  text: string;

  @Prop([
    {
      type: mongoose.Types.ObjectId,
      ref: Schemas.Markup,
      required: true,
      default: [],
    },
  ])
  markups: string[];

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Schemas.ImageMetadata,
    required: false,
  })
  metadata?: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Schemas.CodeMetadata,
    required: false,
  })
  codeMetadata?: string;
}

export const ParagraphSchema = SchemaFactory.createForClass(Paragraph);
