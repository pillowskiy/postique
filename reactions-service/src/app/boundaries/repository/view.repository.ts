import { ViewEntity } from '@/domain/view/view.entity';

export abstract class ViewRepository {
  abstract findUserView(
    userId: string,
    targetId: string,
  ): Promise<ViewEntity | null>;
  abstract save(view: ViewEntity): Promise<void>;
  abstract countByTarget(targetId: string): Promise<number>;
  abstract deleteByUser(userId: string): Promise<void>;
  abstract delete(userId: string, targetId: string): Promise<void>;

  abstract getUserHistory(
    userId: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<ViewEntity[]>;

  abstract getReadingStatsByTarget(targetId: string): Promise<{
    avgReadPercentage: number;
    avgReadingTime: number;
    totalViews: number;
  }>;
}
