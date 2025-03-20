import { Prop, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { MongoSchema } from '../../shared/schema';

export type CodeMetadataDocument = HydratedDocument<CodeMetadata>;

@MongoSchema()
export class CodeMetadata {
  @Prop({ type: String, required: true, default: 'text' })
  lang: string;

  @Prop({ type: Boolean, required: true, default: false })
  spellcheck: boolean;
}

export const CodeMetadataSchema = SchemaFactory.createForClass(CodeMetadata);
