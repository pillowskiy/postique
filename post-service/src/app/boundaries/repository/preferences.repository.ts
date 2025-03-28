import { PostPreferencesEntity } from '@/domain/preferences';

export abstract class PreferencesRepository {
  abstract save(
    userId: string,
    preferences: PostPreferencesEntity,
  ): Promise<void>;

  abstract preferences(userId: string): Promise<PostPreferencesEntity>;
}
