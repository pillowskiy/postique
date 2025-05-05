import { DomainBusinessRuleViolation } from '@/domain/common/error';
import { EntityFactory } from '../../common/entity';
import type {
  IncomingPostPreferences,
  IPostPreferences,
} from './preferences.interface';
import { PostPreferencesSchema } from './preferences.schema';

export class PostPreferencesEntity implements IPostPreferences {
  static empty(userId: string): PostPreferencesEntity {
    return PostPreferencesEntity.create({
      userId,
      postsBlacklist: [],
      authorBlacklist: [],
    });
  }

  static create(preferences: IncomingPostPreferences): PostPreferencesEntity {
    const validPreferences = EntityFactory.create(
      PostPreferencesSchema,
      preferences,
    );
    return new PostPreferencesEntity(validPreferences);
  }

  public readonly userId: string;
  public readonly postsBlacklist: Set<string>;
  public readonly authorBlacklist: Set<string>;

  private constructor(preferences: IPostPreferences) {
    this.userId = preferences.userId;
    this.postsBlacklist = new Set(preferences.postsBlacklist);
    this.authorBlacklist = new Set(preferences.authorBlacklist);
  }

  public mutePost(postId: string): void {
    if (this.postsBlacklist.has(postId)) {
      throw new DomainBusinessRuleViolation('Post is already muted');
    }
    this.postsBlacklist.add(postId);
  }

  public unmutePost(postId: string): void {
    if (!this.postsBlacklist.has(postId)) {
      throw new DomainBusinessRuleViolation('Post is not muted');
    }
    this.postsBlacklist.add(postId);
  }

  public muteAuthor(userId: string): void {
    if (this.authorBlacklist.has(userId)) {
      throw new DomainBusinessRuleViolation('Author is already muted');
    }
    this.authorBlacklist.add(userId);
  }

  public unmuteAuthor(userId: string): void {
    if (!this.authorBlacklist.has(userId)) {
      throw new DomainBusinessRuleViolation('Author is not muted');
    }
    this.authorBlacklist.add(userId);
  }

  public isPostMuted(postId: string): boolean {
    return this.postsBlacklist.has(postId);
  }

  public isAuthorMuted(userId: string): boolean {
    return this.authorBlacklist.has(userId);
  }
}
