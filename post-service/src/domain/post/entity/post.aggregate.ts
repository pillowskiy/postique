import {
  DomainBusinessRuleViolation,
  DomainInvariantViolation,
} from '@/domain/common/error';
import { PostContentAggregate } from '@/domain/content';
import { EntityFactory } from '../../common/entity';
import {
  IDetailedPost,
  IncomingPost,
  IPost,
  PostStatus,
} from './post.interface';
import { PostSchema } from './post.schema';
import { PostEntity } from './post.entity';

export class PostAggregate<HasContent extends boolean = false>
  extends PostEntity
  implements IDetailedPost
{
  static create(post: IncomingPost): PostAggregate {
    const validPost = EntityFactory.create(PostSchema, post);
    return new PostAggregate(validPost);
  }

  private _content: HasContent extends true ? PostContentAggregate : null;

  private constructor(post: IPost) {
    super(post);
  }

  get content(): PostContentAggregate {
    if (!this.hasContent()) {
      throw new DomainInvariantViolation(
        "You trying to access content of a post that doesn't have any content",
      );
    }

    return this._content;
  }

  hasContent(): this is PostAggregate<true> {
    return !!this._content;
  }

  withContent(content: PostContentAggregate): PostAggregate<true> {
    const current = this as PostAggregate<true>;
    current._content = content;
    return current;
  }

  publish() {
    if (this.status !== PostStatus.Draft) {
      throw new DomainBusinessRuleViolation('Post is not in draft state');
    }

    this._status = PostStatus.Published;
    this._publishedAt = new Date();
  }

  archive() {
    if (this.status === PostStatus.Archived) {
      throw new DomainBusinessRuleViolation('Post is already archived');
    }

    this._status = PostStatus.Archived;
    this._publishedAt = null;
  }
}
