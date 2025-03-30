import { DomainBusinessRuleViolation } from '@/domain/common/error';
import { ParagraphAggregate } from '@/domain/content';
import { EntityFactory } from '../../common/entity';
import { PostEntity } from './post.entity';
import {
  IDetailedPost,
  IncomingPost,
  IPost,
  PostStatus,
} from './post.interface';
import { PostSchema } from './post.schema';

export class PostAggregate extends PostEntity implements IDetailedPost {
  static create(post: IncomingPost): PostAggregate {
    const validPost = EntityFactory.create(PostSchema, post);
    return new PostAggregate(validPost);
  }

  static root(post: PostEntity): PostAggregate {
    return new PostAggregate(post);
  }

  private _paragraphs: ParagraphAggregate[] = [];

  private constructor(post: IPost) {
    super(post);
  }

  get paragraphs(): ParagraphAggregate[] {
    return this._paragraphs;
  }

  publish() {
    if (this.status !== PostStatus.Draft) {
      throw new DomainBusinessRuleViolation('Post is not in draft state');
    }

    const contentLength = this.paragraphs.reduce(
      (acc, p) => acc + p.text.length,
      0,
    );
    if (contentLength < 128) {
      throw new DomainBusinessRuleViolation(
        'Post content must have at least 128 characters',
      );
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

  appendParagraph(paragraph: ParagraphAggregate) {
    this._paragraphs.push(paragraph);
  }
}
