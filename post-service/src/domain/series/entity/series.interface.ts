import { IncomingEntity } from '../../common/entity';

export enum PostSeriesVisibility {
  Public = 'public',
  Private = 'private',
}

export type IncomingPostSeries = IncomingEntity<
  IPostSeries,
  { visibility: string }
>;

export interface IPostSeries {
  id: string;
  title: string;
  slug: string;
  owner: string;
  visibility: PostSeriesVisibility;
  description: string;
  posts: Readonly<string[]>;
}
