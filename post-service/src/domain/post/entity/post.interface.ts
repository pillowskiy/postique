import type { IncomingEntity } from '../../common/entity';

export enum PostStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

export enum PostVisibility {
  Public = 'public',
  Private = 'private',
  Unlisted = 'unlisted',
  Subscribers = 'subscribers',
  Premium = 'premium',
}

export type IncomingPost = IncomingEntity<
  IPost,
  { status: string; visibility: string; content: Partial<IPostContent> }
>;

export interface IPost {
  id: string;

  content: Readonly<IPostContent>;
  owner: string;
  authors: Readonly<string[]>;
  slug: string;
  status: PostStatus;
  visibility: PostVisibility;
  publishedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export type IncomingPostContent = Partial<IPostContent>;

export interface IPostContent {
  coverImage: string | null;
  title: string;
  description: string;
  content: string;
  createdAt: Date;
}
