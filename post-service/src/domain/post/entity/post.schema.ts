import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDate,
  MinLength,
  MaxLength,
  IsUUID,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { type IPost, PostStatus, PostVisibility } from './post.interface';
import { Transform, Type } from 'class-transformer';
import { randomUUID } from 'crypto';
import slugify from 'slugify';

export class PostSchema implements IPost {
  @IsString({ message: 'ID must be a string' })
  @IsNotEmpty({ message: 'ID cannot be empty' })
  @IsUUID(4, { message: 'ID has incorrect format' })
  id: string = randomUUID();

  @IsString({ message: 'Owner must be a string' })
  @IsNotEmpty({ message: 'Owner cannot be empty' })
  owner: string;

  @Transform(
    ({ value, obj }) =>
      value || slugify(obj.title, { lower: true, strict: true }),
  )
  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug cannot be empty' })
  @MinLength(3, { message: 'Slug must be at least 3 characters' })
  @MaxLength(128, { message: 'Slug must be at most 128 characters' })
  slug: string;

  @IsEnum(PostStatus, { message: 'Invalid post status' })
  status: PostStatus;

  @IsEnum(PostVisibility, { message: 'Invalid post visibility' })
  visibility: PostVisibility;

  @IsArray({ message: 'Post authors must be a list of references' })
  @ArrayNotEmpty({ message: 'Post must have at least one author' })
  @IsUUID('4', {
    each: true,
    message: 'Post author reference has incorrect format',
  })
  authors: Readonly<string[]>;

  @IsOptional()
  @IsDate({ message: 'PublishedAt must be a valid date or null' })
  @Type(() => Date)
  publishedAt: Date | null = null;

  @IsDate({ message: 'CreatedAt must be a valid date' })
  @Type(() => Date)
  createdAt: Date = new Date();

  @IsString({ message: 'Content ID must be a string' })
  @IsNotEmpty({ message: 'Content ID cannot be empty' })
  @IsUUID(4, { message: 'Content ID has incorrect format' })
  contentId: string;

  @IsDate({ message: 'UpdatedAt must be a valid date' })
  @Type(() => Date)
  updatedAt: Date = new Date();
}
