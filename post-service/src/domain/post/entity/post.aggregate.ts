import { DomainBusinessRuleViolation } from '@/domain/common/error';
import { ParagraphAggregate } from '@/domain/content';
import { EntityFactory } from '../../common/entity';
import {
  IDetailedPost,
  IncomingPost,
  IPost,
  PostStatus,
} from './post.interface';
import { PostSchema } from './post.schema';
import { PostEntity } from './post.entity';

export class PostAggregate extends PostEntity implements IDetailedPost {
  static create(post: IncomingPost): PostAggregate {
    const validPost = EntityFactory.create(PostSchema, post);
    return new PostAggregate(validPost);
  }

  private _paragraphs: ParagraphAggregate<any>[] = [];

  private constructor(post: IPost) {
    super(post);
  }

  get paragraphs(): ParagraphAggregate<any>[] {
    return this._paragraphs;
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

  changeContent(_: string[]): never {
    throw new Error('Method is not available in aggregate.');
  }
}
