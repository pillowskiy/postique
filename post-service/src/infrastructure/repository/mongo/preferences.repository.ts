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

  async preferences(userId: string): Promise<PostPreferencesEntity> {
    const userPrefs = await this._preferencesModel.findOne({ userId }).lean();
    if (!userPrefs) {
      return PostPreferencesEntity.empty();
    }

    return this.#getPreferences(userPrefs);
  }

  #getPreferences(pref: PostPreferences): PostPreferencesEntity {
    return PostPreferencesEntity.create({
      authorBlacklist: new Set(...pref.authorBlacklist),
      postsBlacklist: new Set(...pref.postsBlacklist),
    } satisfies IPostPreferences);
  }
}
