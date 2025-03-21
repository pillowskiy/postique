import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { randomUUID } from 'crypto';
import type { IUser } from './user.interface';

export class UserSchema implements IUser {
  @IsString({ message: 'ID must be a string' })
  @IsNotEmpty({ message: 'ID cannot be empty' })
  @IsUUID(4, { message: 'ID has incorrect format' })
  id: string = randomUUID();

  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username cannot be empty string' })
  @MaxLength(128, { message: 'Username must be at most 128 characters' })
  @MinLength(2, { message: 'Username must be greater than 2 characters' })
  username: string;

  @IsString({ message: 'Avatar path must be a string' })
  @MaxLength(256, { message: 'Avatar path must be at most 256 characters' })
  avatarPath: string;
}
