import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MongoSchema, Schemas } from '../shared/schema';
import { ModerationStatus } from '@/domain/moderation';

export type ModerationDocument = HydratedDocument<Moderation>;

@MongoSchema()
export class Moderation {
  @Prop({ type: mongoose.Types.ObjectId, ref: Schemas.Posts, required: true })
  postId: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: Schemas.Users, required: true })
  moderatorId: string;

  @Prop({ type: String, enum: ModerationStatus, required: true })
  status: ModerationStatus;

  @Prop({ type: String, required: true, default: '' })
  reason: string;
}

export const ModerationSchema = SchemaFactory.createForClass(Moderation);
