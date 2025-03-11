import type { IncomingEntity } from '../../common/entity';

export enum ModerationStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export type IncomingModeration = IncomingEntity<
  IModeration,
  { status: string }
>;

export interface IModeration {
  postId: string;
  moderator: string | null;
  status: ModerationStatus;
  reason: string;
  createdAt: Date;
}
