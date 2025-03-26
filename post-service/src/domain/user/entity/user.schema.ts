import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsUUID,
  IsEmail,
} from 'class-validator';
import { randomUUID } from 'crypto';
import type { IUser } from './user.interface';

export class UserSchema implements IUser {
  @IsString({ message: 'ID must be a string' })
  @IsNotEmpty({ message: 'ID cannot be empty' })
  @IsUUID(4, { message: 'ID has incorrect format' })
  id: string = randomUUID();

  @MaxLength(512, { message: 'Email must be at most 512 characters' })
  @IsEmail({}, { message: 'Email is not valid' })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username cannot be empty string' })
  @MaxLength(128, { message: 'Username must be at most 128 characters' })
  @MinLength(2, { message: 'Username must be greater than 2 characters' })
  username: string;

  @IsString({ message: 'Avatar path must be a string' })
  @MaxLength(256, { message: 'Avatar path must be at most 256 characters' })
  avatarPath: string;
}
