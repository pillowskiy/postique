import { IncomingEntity } from '../../common/entity';

export type IncomingPostPreferences = IncomingEntity<IPostPreferences, {}>;

export interface IPostPreferences {
  postsBlacklist: Set<string>;
  authorBlacklist: Set<string>;
}
