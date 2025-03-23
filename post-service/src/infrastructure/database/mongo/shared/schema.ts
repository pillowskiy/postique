import { Prop, PropOptions, Schema, SchemaOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum Schemas {
  Posts = 'posts',
  Users = 'users',
  Series = 'series',
  Preferences = 'preferences',
  Moderation = 'moderation',
  Paragraph = 'paragraphs',
}

export function PropOptimizedUUID(options: PropOptions = {}) {
  return Prop(
    Object.assign(
      {
        type: mongoose.Types.UUID,
        required: true,
      },
      options,
    ),
  );
}

export function MongoSchema(options: SchemaOptions = {}) {
  return Schema(
    Object.assign(
      {
        _id: false,
        id: true,
        optimisticConcurrency: true,
        timestamps: true,
      },
      options,
    ),
  );
}
