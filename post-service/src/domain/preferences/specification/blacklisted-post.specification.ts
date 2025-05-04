import { Specification } from '@/domain/common/specification';
import { PostEntity } from '@/domain/post';

export class IsBlacklistedPostSpecification
  implements Specification<PostEntity>
{
  constructor(private blacklistedPostIds: Set<string>) {}

  isSatisfiedBy(post: PostEntity): boolean {
    return this.blacklistedPostIds.has(post.id);
  }
}
