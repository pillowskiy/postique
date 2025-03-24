import { PostPreferencesEntity } from '@/domain/preferences';

export abstract class PreferencesRepository {
  abstract preferences(userId: string): Promise<PostPreferencesEntity>;
}
