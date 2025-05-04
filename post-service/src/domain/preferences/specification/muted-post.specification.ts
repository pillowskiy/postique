import { Specification } from '@/domain/common/specification';
import { PostEntity } from '@/domain/post';

export class IsMutedPostSpecification implements Specification<PostEntity> {
  constructor(private mutedAuthors: Set<string>) {}

  isSatisfiedBy(post: PostEntity): boolean {
    return this.mutedAuthors.has(post.owner);
  }
}
