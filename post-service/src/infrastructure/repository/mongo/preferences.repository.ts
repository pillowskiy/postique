import { PreferencesRepository } from '@/app/boundaries/repository/preferences.repository';
import { IPostPreferences, PostPreferencesEntity } from '@/domain/preferences';
import { InjectModel, models, Schemas } from '@/infrastructure/database/mongo';
import { PostPreferences } from '@/infrastructure/database/mongo/schemas';

export class MongoPreferencesRepository extends PreferencesRepository {
  constructor(
    @InjectModel(Schemas.Preferences)
    private readonly _preferencesModel: models.PostPreferencesModel,
  ) {
    super();
  }

  async save(
    userId: string,
    preferences: PostPreferencesEntity,
  ): Promise<void> {
    await this._preferencesModel.updateOne(
      { userId },
      {
        $set: this.#preferencesFields(userId, preferences),
      },
      {
        upsert: true,
      },
    );
  }

  async preferences(userId: string): Promise<PostPreferencesEntity> {
    const userPrefs = await this._preferencesModel.findOne({ userId }).lean();
    if (!userPrefs) {
      return PostPreferencesEntity.empty();
    }

    return this.#getPreferences(userPrefs);
  }

  #preferencesFields(
    userId: string,
    preferences: PostPreferencesEntity,
  ): PostPreferences {
    return {
      userId,
      authorBlacklist: Array.from(preferences.authorBlacklist),
      postsBlacklist: Array.from(preferences.postsBlacklist),
    };
  }

  #getPreferences(pref: PostPreferences): PostPreferencesEntity {
    return PostPreferencesEntity.create({
      authorBlacklist: new Set(...pref.authorBlacklist),
      postsBlacklist: new Set(...pref.postsBlacklist),
    } satisfies IPostPreferences);
  }
}
