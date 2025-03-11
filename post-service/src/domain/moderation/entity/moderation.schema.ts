import { Type } from 'class-transformer';
import { ModerationStatus, IModeration } from './moderation.interface';

import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDate,
} from 'class-validator';

export class ModerationSchema implements IModeration {
  @IsString({ message: 'Post ID must be a string' })
  @IsNotEmpty({ message: 'Post ID cannot be empty' })
  @IsUUID(4, { message: 'Post ID has incorrect format' })
  public readonly postId: string;

  @IsOptional()
  @IsString({ message: 'Moderator ID must be a string' })
  @IsUUID(4, { message: 'Moderator ID has incorrect format' })
  public readonly moderator: string | null;

  @IsEnum(ModerationStatus, { message: 'Moderation status is invalid' })
  public readonly status: ModerationStatus;

  @IsString({ message: 'Reason must be a string' })
  @MaxLength(4096, { message: 'Reason must be at most 4096 characters' })
  public readonly reason: string;

  @IsDate({ message: 'CreatedAt must be a valid date' })
  @Type(() => Date)
  public readonly createdAt: Date = new Date();
}
