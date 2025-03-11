import { Transform } from 'class-transformer';
import { IPostPreferences } from './preferences.interface';
import { IsUUID, ArrayUnique, IsNotEmpty } from 'class-validator';

export class PostPreferencesSchema implements IPostPreferences {
  @Transform(({ value }) => new Set(value), { toClassOnly: true })
  @ArrayUnique({ message: 'postsBlacklist cannot have duplicate entries' })
  @IsUUID('4', {
    each: true,
    message: 'Each entry in postsBlacklist must be a valid UUID v4',
  })
  @IsNotEmpty({ message: 'postsBlacklist should not be empty' })
  postsBlacklist: Set<string>;

  @Transform(({ value }) => new Set(value), { toClassOnly: true })
  @ArrayUnique({ message: 'authorBlacklist cannot have duplicate entries' })
  @IsUUID('4', {
    each: true,
    message: 'Each entry in authorBlacklist must be a valid UUID v4',
  })
  @IsNotEmpty({ message: 'authorBlacklist should not be empty' })
  authorBlacklist: Set<string>;
}
