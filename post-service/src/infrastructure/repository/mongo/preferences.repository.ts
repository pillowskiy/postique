import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@/app/boundaries/common';
import { PreferencesRepository } from '@/app/boundaries/repository/preferences.repository';
import { IPostPreferences, PostPreferencesEntity } from '@/domain/preferences';
import {
  InjectModel,
  models,
  MongoTransactional,
  Schemas,
} from '@/infrastructure/database/mongo';
import { PostPreferences } from '@/infrastructure/database/mongo/schemas';

@Injectable()
export class MongoPreferencesRepository extends PreferencesRepository {
  @Inject(Transactional)
  private readonly _transactional: MongoTransactional;

  @InjectModel(Schemas.Preferences)
  private readonly _preferencesModel: models.PostPreferencesModel;

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
        session: this._transactional.getSession(undefined),
      },
    );
  }

  async preferences(userId: string): Promise<PostPreferencesEntity> {
    const userPrefs = await this._preferencesModel
      .findOne({ userId })
      .session(this._transactional.getSession(null))
      .lean();
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
      userId: pref.userId,
      authorBlacklist: new Set(...pref.authorBlacklist),
      postsBlacklist: new Set(...pref.postsBlacklist),
    } satisfies IPostPreferences);
  }
}
