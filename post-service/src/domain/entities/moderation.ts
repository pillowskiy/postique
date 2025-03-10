import { ModerationStatus } from '../enums/moderation';

export class PostModeration {
  private constructor(
    public readonly postId: string,
    private _moderatorId: string | null,
    private _status: ModerationStatus,
    private _reason: string,
    public readonly createdAt: Date = new Date(),
  ) {}

  get moderator(): string | null {
    return this._moderatorId;
  }

  get status(): ModerationStatus {
    return this._status;
  }

  get reason(): string | null {
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
