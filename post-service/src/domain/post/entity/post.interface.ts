import { IUser } from '@/domain/user';
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
  { status: string; visibility: string }
>;

export interface IDetailedPost extends IPost {
  ownerRef: IUser;
}

export type IncomingPost = IncomingEntity<
  IPost,
  { status: string; visibility: string }
>;

export interface IPostMetadata {
  title: string;
  description: string;
  coverImage: string;
}

export interface IPost extends IPostMetadata {
  id: string;
  owner: string;
  authors: Readonly<string[]>;
  slug: string;
  content: string;
  status: PostStatus;
  visibility: PostVisibility;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
