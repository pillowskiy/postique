import { EntityFactory, IncomingEntity } from '../common/entity';
import { ReactionEntity, ReactionType } from '../reaction/reaction.entity';
import { ViewSchema } from './view.schema';

export class ViewEntity extends ReactionEntity {
  static create(input: IncomingEntity<ViewEntity>): ViewEntity {
    const validView = EntityFactory.create(ViewSchema, input);

    return new ViewEntity(
      validView.userId,
      validView.targetId,
      validView.createdAt!,
      validView.readPercentage,
      validView.readingTime,
      validView.referrer,
      validView.userAgent,
    );
  }

  private constructor(
    userId: string | null,
    targetId: string,
    createdAt: Date,
    private readonly _readPercentage: number = 0,
    private readonly _readingTime: number = 0,
    private readonly _referrer?: string,
    private readonly _userAgent?: string,
  ) {
    super(userId || 'anonymous', targetId, createdAt, createdAt);
  }

  type(): ReactionType {
    return ReactionType.View;
  }

  get readPercentage(): number {
    return this._readPercentage;
  }

  get readingTime(): number {
    return this._readingTime;
  }

  get referrer(): string | undefined {
    return this._referrer;
  }

  get userAgent(): string | undefined {
    return this._userAgent;
  }

  isAnonymous(): boolean {
    return this.userId === 'anonymous';
  }
}
