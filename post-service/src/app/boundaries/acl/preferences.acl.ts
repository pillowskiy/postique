import { PostPreferencesEntity } from '@/domain/preferences';
import { AccessControlListResult } from './common';

export abstract class PreferencesAccessControlList {
  abstract canModify(
    userId: string,
    pref: PostPreferencesEntity,
  ): AccessControlListResult;
}
