import { PostStatus } from '@/domain/post';

export class GetMyPostsQuery {
  constructor(
    public readonly status: PostStatus,
    public readonly userId: string,
    public readonly take: number,
    public readonly skip: number,
  ) {}
}
