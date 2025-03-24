import { MarkupType } from '@/domain/content';
import { ParagraphType } from '@/domain/content/paragraph/content-paragraph.interface';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongoSchema, PropOptimizedUUID } from '../shared/schema';

export type ParagraphDocument = HydratedDocument<Paragraph>;

export type Markup = {
  type: MarkupType;
  start: number;
  end: number;
  href?: string;
};

export type ImageMetadata = {
  src: string;
  originalWidth: number;
  originalHeight: number;
  alt?: string;
};

export type CodeMetadata = {
  lang: string;
  spellcheck: boolean;
};

@MongoSchema({ timestamps: false })
export class Paragraph {
  @PropOptimizedUUID()
  _id: string;

  @Prop({ type: String, default: '' })
  text: string;

  @Prop({ enum: ParagraphType, required: true })
  type: ParagraphType;

  @Prop({
    type: [
      {
        type: { type: Number, enum: MarkupType, required: true },
        href: { type: String, required: false },
        start: { type: Number, required: true },
        end: { type: Number, required: true },
      },
    ],
    required: true,
    default: [],
  })
  markups: Markup[];

  @Prop({
    type: {
      src: { type: String, required: true },
      originalWidth: { type: Number, required: true },
      originalHeight: { type: Number, required: true },
      alt: { type: String, required: false },
    },
    required: false,
  })
  metadata?: ImageMetadata;

  @Prop({
    type: {
      lang: { type: String, required: true, default: 'text' },
      spellcheck: { type: Boolean, required: true, default: false },
    },
    required: false,
  })
  codeMetadata?: CodeMetadata;
}

export const ParagraphSchema = SchemaFactory.createForClass(Paragraph);
