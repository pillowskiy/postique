import { InjectModel as NestInjectModel } from '@nestjs/mongoose';
import { Schemas } from './common/schema';
import * as schemas from './schemas';
import { Model } from 'mongoose';

export namespace models {
  export type PostModel = Model<schemas.Post>;
  export type UserModel = Model<schemas.User>;
  export type PostSeriesModel = Model<schemas.PostSeries>;
  export type ModerationModel = Model<schemas.Moderation>;
  export type PostPreferencesModel = Model<schemas.PostPreferences>;
}

export function InjectModel<S extends Schemas>(schema: S) {
  return NestInjectModel(schema);
}
