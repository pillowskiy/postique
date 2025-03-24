import type { IncomingEntity } from '../../common/entity';
import { IParagraph } from '@/domain/content/paragraph/content-paragraph.interface';

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
  paragraphs: Readonly<IParagraph[]>;
}

export type IncomingPost = IncomingEntity<
  IPost,
  { status: string; visibility: string }
>;

export interface IPost {
  id: string;
  title: string;
  description: string;
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
