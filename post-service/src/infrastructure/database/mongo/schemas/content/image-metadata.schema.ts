import { Prop, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { MongoSchema } from '../../shared/schema';

export type ImageMetadataDocument = HydratedDocument<ImageMetadata>;

@MongoSchema()
export class ImageMetadata {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: Number, required: true })
  originalWidth: number;

  @Prop({ type: Number, required: true })
  originalHeight: number;

  @Prop({ type: String, required: false })
  alt?: string;
}

export const ImageMetadataSchema = SchemaFactory.createForClass(ImageMetadata);
