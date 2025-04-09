import {
  ReactionEntity,
  ReactionType,
} from '@/domain/reaction/reaction.entity';
import { EntityFactory, IncomingEntity } from '../common/entity';
import { LikeSchema } from './like.schema';

export class LikeEntity extends ReactionEntity {
  static create(input: IncomingEntity<LikeEntity>): LikeEntity {
    const validLike = EntityFactory.create(LikeSchema, input);
    return new LikeEntity(
      validLike.id!,
      validLike.userId,
      validLike.targetId,
      validLike.createdAt,
      validLike.updatedAt,
    );
  }

  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly targetId: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, userId, targetId, createdAt, updatedAt);
  }

  type(): ReactionType {
    return ReactionType.Like;
  }
}
