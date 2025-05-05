import { ArrayUnique, IsUUID } from 'class-validator';
import { IPostPreferences } from './preferences.interface';

export class PostPreferencesSchema implements IPostPreferences {
  @IsUUID('4', {
    message: 'userId must be a valid UUID v4',
  })
  userId: string;

  @ArrayUnique({ message: 'postsBlacklist cannot have duplicate entries' })
  @IsUUID('4', {
    each: true,
    message: 'Each entry in postsBlacklist must be a valid UUID v4',
  })
  postsBlacklist: Set<string>;

  @ArrayUnique({ message: 'authorBlacklist cannot have duplicate entries' })
  @IsUUID('4', {
    each: true,
    message: 'Each entry in authorBlacklist must be a valid UUID v4',
  })
  authorBlacklist: Set<string>;
}
