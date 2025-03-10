import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ id: true, optimisticConcurrency: true, timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true, index: true })
  refId: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  username: string;

  @Prop({ type: String, default: null })
  bio: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
