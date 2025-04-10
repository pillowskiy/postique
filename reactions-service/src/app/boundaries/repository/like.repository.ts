import { LikeEntity } from '@/domain/like/like.entity';

export abstract class LikeRepository {
  abstract findById(id: string): Promise<LikeEntity | null>;
  abstract findUserLike(
    userId: string,
    targetId: string,
  ): Promise<LikeEntity | null>;
  abstract findByTarget(targetId: string): Promise<LikeEntity[]>;
  abstract findByUser(userId: string): Promise<LikeEntity[]>;
  abstract save(like: LikeEntity): Promise<void>;
  abstract delete(likeId: string): Promise<void>;
  abstract countByTarget(targetId: string): Promise<number>;
}
