import { IPostContent } from '@/domain/content/content.interface';
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

export type IncomigDetailedPost = IncomingEntity<
  IDetailedPost,
  { status: string; visibility: string; content: Partial<IPostContent> }
>;

export interface IDetailedPost extends IPost {
  content: Readonly<IPostContent>;
}

export type IncomingPost = IncomingEntity<
  IPost,
  { status: string; visibility: string; content: Partial<IPostContent> }
>;

export interface IPost {
  id: string;
  owner: string;
  authors: Readonly<string[]>;
  slug: string;
  contentId: string;
  status: PostStatus;
  visibility: PostVisibility;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
