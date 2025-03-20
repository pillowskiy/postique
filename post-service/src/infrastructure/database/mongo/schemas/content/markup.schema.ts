import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { type HydratedDocument } from 'mongoose';
import { MongoSchema, Schemas } from '../../shared/schema';
import { MarkupType } from '@/domain/content/markup';

export type MarkupDocument = HydratedDocument<Markup>;

@MongoSchema()
export class Markup {
  @Prop({ enum: MarkupType, required: true })
  type: MarkupType;

  @Prop({ type: String, required: false })
  href?: string | undefined;

  @Prop({ type: Number, required: true })
  start: number;

  @Prop({ type: Number, required: true })
  end: number;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Schemas.Paragraph,
    required: true,
  })
  paragraphId: string;
}

export const MarkupSchema = SchemaFactory.createForClass(Markup);
