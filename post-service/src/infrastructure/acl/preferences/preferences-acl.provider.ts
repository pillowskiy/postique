import { PreferencesAccessControlList } from '@/app/boundaries/acl';
import { PostPreferencesEntity } from '@/domain/preferences';

export class PreferencesAccessControlListProvider extends PreferencesAccessControlList {
  canModify(userId: string, pref: PostPreferencesEntity): boolean {
    return this._isOwner(userId, pref);
  }

  private _isOwner(userId: string, pref: PostPreferencesEntity): boolean {
    console.log('Checking ownership for userId:', userId, pref);
    return userId === pref.userId;
  }
}
