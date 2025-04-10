import { LikeEntity } from '@/domain/like/like.entity';

export abstract class LikeRepository {
  abstract findUserLike(
    userId: string,
    targetId: string,
  ): Promise<LikeEntity | null>;
  abstract findByTarget(targetId: string): Promise<LikeEntity[]>;
  abstract findByUser(userId: string): Promise<LikeEntity[]>;
  abstract save(like: LikeEntity): Promise<void>;
  abstract delete(userId: string, targetId: string): Promise<void>;
  abstract countByTarget(targetId: string): Promise<number>;
}
