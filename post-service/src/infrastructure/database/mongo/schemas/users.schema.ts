import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongoSchema, PropOptimizedUUID } from '../shared/schema';

export type UserDocument = HydratedDocument<User>;

@MongoSchema()
export class User {
  @PropOptimizedUUID()
  _id: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  email: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  username: string;

  @Prop({ type: String, required: true })
  avatarPath: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
