import { EntityFactory } from '../../common/entity';
import type {
  IncomingPostPreferences,
  IPostPreferences,
} from './preferences.interface';
import { PostPreferencesSchema } from './preferences.schema';

export class PostPreferences implements IPostPreferences {
  static create(preferences: IncomingPostPreferences): PostPreferences {
    const validPreferences = EntityFactory.create(
      PostPreferencesSchema,
      preferences,
    );
    return new PostPreferences(validPreferences);
  }

  private constructor(preferences: IPostPreferences) {
    this.postsBlacklist = preferences.postsBlacklist;
    this.authorBlacklist = preferences.authorBlacklist;
  }

  public readonly postsBlacklist: Set<string>;
  public readonly authorBlacklist: Set<string>;

  public mutePost(postId: string): void {
    if (this.isPostMuted(postId)) {
      throw new Error('Post is already muted');
    }
    this.postsBlacklist.add(postId);
  }

  public unmutePost(postId: string): void {
    if (!this.isPostMuted(postId)) {
      throw new Error('This post is not muted');
    }
    this.postsBlacklist.add(postId);
  }

  public muteAuthor(userId: string): void {
    if (this.isAuthorMuted(userId)) {
      throw new Error('User is already muted');
    }
    this.authorBlacklist.add(userId);
  }

  public unmuteAuthor(userId: string): void {
    if (this.isAuthorMuted(userId)) {
      throw new Error('User is not muted');
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
