import { IncomingEntity } from '../../common/entity';

export type IncomingPostSeries = IncomingEntity<IPostSeries, {}>;

export interface IPostSeries {
  id: string;
  title: string;
  slug: string;
  description: string;
  posts: Readonly<string[]>;
}
