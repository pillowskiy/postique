import { EntityFactory } from '../../common/entity';
import {
  IModeration,
  IncomingModeration,
  ModerationStatus,
} from './moderation.interface';
import { ModerationSchema } from './moderation.schema';

export class PostModeration implements IModeration {
  static create(moderation: IncomingModeration): PostModeration {
    const validModeration = EntityFactory.create(ModerationSchema, moderation);
    return new PostModeration(validModeration);
  }

  public readonly postId: string;
  private _moderatorId: string | null;
  private _status: ModerationStatus;
  private _reason: string;
  public readonly createdAt: Date = new Date();

  private constructor(moderation: IModeration) {
    this.postId = moderation.postId;
    this._moderatorId = moderation.moderator;
    this._status = moderation.status;
    this._reason = moderation.reason;
  }

  get moderator(): string | null {
    return this._moderatorId;
  }

  get status(): ModerationStatus {
    return this._status;
  }

  get reason(): string {
    return this._reason;
  }

  approve(): void {
    if (this._status !== ModerationStatus.Pending) {
      throw new Error('Moderation is not pending');
    }
    this._status = ModerationStatus.Approved;
  }

  reject(reason: string = ''): void {
    if (this._status !== ModerationStatus.Pending) {
      throw new Error('Moderation is not pending');
    }

    this._status = ModerationStatus.Rejected;
    this._reason = reason;
  }

  rejected(): boolean {
    return this._status === ModerationStatus.Rejected;
  }

  approved(): boolean {
    return this._status === ModerationStatus.Approved;
  }
}
