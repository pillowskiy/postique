import { EntityFactory } from '../../common/entity';
import {
  IncomingPost,
  IPost,
  IPostContent,
  PostStatus,
  PostVisibility,
} from './post.interface';
import { PostSchema } from './post.schema';

export class PostAggregate implements IPost {
  static create(post: IncomingPost): PostAggregate {
    const validPost = EntityFactory.create(PostSchema, post);
    return new PostAggregate(validPost);
  }

  public readonly id: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private _approved: boolean;
  private _content: PostContent;
  private _owner: string;
  private _authors: string[];
  private _slug: string;
  private _status: PostStatus;
  private _visibility: PostVisibility;
  private _publishedAt: Date | null;

  private constructor(post: IPost) {
    this.id = post.id;

    this._owner = post.owner;
    this._slug = post.slug;
    this._status = post.status;
    this._visibility = post.visibility;

    this._publishedAt = post.publishedAt;
    this.updatedAt = post.updatedAt;
    this.createdAt = post.createdAt;
  }

  get approved(): boolean {
    return this._approved;
  }

  get content(): Readonly<PostContent> {
    return this._content;
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

  setApproved(approved: boolean) {
    this._approved = approved;
  }

  changeVisibility(visibility: PostVisibility) {
    this._visibility = visibility;
  }

  publish() {
    if (this.status !== PostStatus.Draft) {
      throw new Error('Post is not in draft state');
    }

    this._status = PostStatus.Published;
    this._publishedAt = new Date();
  }

  archive() {
    if (this.status === PostStatus.Archived) {
      throw new Error('Post is already archived');
    }

    this._status = PostStatus.Archived;
    this._publishedAt = null;
  }

  changeContent(content: PostContent) {
    this._slug = content.title;
    this._content = content;
  }

  setOwner(userId: string) {
    this._owner = userId;
  }
}

export class PostContent implements IPostContent {
  private readonly _coverImage: string | null = null;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _content: string;
  private readonly _editedAt: Date | null;
  public readonly createdAt: Date;

  private constructor(
    title: string,
    description: string,
    content: string,
    editedAt: Date | null = new Date(),
    createdAt: Date = new Date(),
  ) {
    this._title = title;
    this._description = description;
    this._content = content;
    this._editedAt = editedAt;
    this.createdAt = createdAt;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get content(): string {
    return this._content;
  }

  get coverImage() {
    return this._coverImage;
  }

  get editedAt(): Date | null {
    return this._editedAt;
  }
}
