import { DomainBusinessRuleViolation } from '@/domain/common/error';
import { EntityFactory } from '../../common/entity';
import {
  IncomingPost,
  IPost,
  PostStatus,
  PostVisibility,
} from './post.interface';

import { PostSchema } from './post.schema';

export class PostEntity implements IPost {
  static create(post: IncomingPost): PostEntity {
    const validPost = EntityFactory.create(PostSchema, post);
    return new PostEntity(validPost);
  }

  public readonly id: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  protected _title: string;
  protected _description: string;

  protected _approved: boolean = false;
  protected _owner: string;
  protected _authors: string[];
  protected _slug: string;
  protected _status: PostStatus;
  protected _visibility: PostVisibility;
  protected _publishedAt: Date | null;
  protected _content: string;

  protected constructor(post: IPost) {
    this.id = post.id;

    this._owner = post.owner;
    this._authors = [...post.authors];
    this._slug = post.slug;
    this._status = post.status;
    this._content = post.content;
    this._visibility = post.visibility;
    this._title = post.title;
    this._description = post.description;

    this._publishedAt = post.publishedAt;
    this.updatedAt = post.updatedAt;
    this.createdAt = post.createdAt;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get approved(): boolean {
    return this._approved;
  }

  get owner(): string {
    return this._owner;
  }

  get authors(): Readonly<string[]> {
    return this._authors;
  }

  get slug(): string {
    return this._slug;
  }

  get status(): PostStatus {
    return this._status;
  }

  get visibility(): PostVisibility {
    return this._visibility;
  }

  get publishedAt(): Date | null {
    return this._publishedAt;
  }

  get content(): string {
    return this._content;
  }

  setApproved(approved: boolean) {
    this._approved = approved;
  }

  changeVisibility(visibility: PostVisibility) {
    if (this.status === PostStatus.Archived) {
      throw new DomainBusinessRuleViolation(
        'You cannot change visibility of an archived post',
      );
    }

    if (this.visibility === visibility) {
      throw new DomainBusinessRuleViolation(
        'Post visibility is already set to this value',
      );
    }

    this._visibility = visibility;
  }

  changeContent(content: string) {
    this._content = content;
  }

  transferOwnership(userId: string) {
    this._owner = userId;
  }

  publish() {
    if (this.status !== PostStatus.Draft) {
      throw new DomainBusinessRuleViolation('Post is not in draft state');
    }

    if (this.description.length < 64) {
      throw new DomainBusinessRuleViolation(
        'Post description must have at least 64 characters',
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
}
