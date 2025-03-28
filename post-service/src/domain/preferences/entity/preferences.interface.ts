import { IncomingEntity } from '../../common/entity';

export type IncomingPostPreferences = IncomingEntity<IPostPreferences, {}>;

export interface IPostPreferences {
  userId?: string;
  postsBlacklist: Set<string>;
  authorBlacklist: Set<string>;
}
