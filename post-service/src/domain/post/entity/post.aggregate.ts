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

  appendParagraph(paragraph: ParagraphAggregate) {
    this._paragraphs.push(paragraph);
  }
}
