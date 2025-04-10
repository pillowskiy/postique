import { LikeEntity } from '@/domain/like/like.entity';
import { LikeOutput } from '../dto/output';

export class LikeMapper {
  static toDto(like: LikeEntity): LikeOutput {
    return new LikeOutput(like.id, like.userId, like.targetId, like.createdAt);
  }
}
