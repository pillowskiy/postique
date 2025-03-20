import { Schema, SchemaOptions } from '@nestjs/mongoose';

export enum Schemas {
  Posts = 'posts',
  Users = 'users',
  Series = 'series',
  Preferences = 'preferences',
  Moderation = 'moderation',
}

export function MongoSchema(options: SchemaOptions = {}) {
  return Schema(
    Object.assign(options, {
      _id: false,
      id: true,
      optimisticConcurrency: true,
      timestamps: true,
    }),
  );
}
