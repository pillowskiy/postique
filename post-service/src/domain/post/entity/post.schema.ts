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
import {
  type IPost,
  type IPostContent,
  PostStatus,
  PostVisibility,
} from './post.interface';
import { Transform, Type } from 'class-transformer';
import { randomUUID } from 'crypto';
import slugify from 'slugify';

export class PostContentSchema implements IPostContent {
  @IsOptional()
  coverImage: string | null = null;

  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(128, { message: 'Title must be at most 128 characters' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @MaxLength(256, { message: 'Description must be at most 256 characters' })
  description: string = '';

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content cannot be empty' })
  @MinLength(48, { message: 'Content must be at least 48 characters' })
  @MaxLength(65546, {
    message: 'Content must be at most 65536 characters',
  })
  content: string;

  @IsOptional()
  @IsDate({ message: 'EditedAt must be a valid date or null' })
  @Type(() => Date)
  editedAt: Date | null = null;

  @IsDate({ message: 'CreatedAt must be a valid date' })
  @Type(() => Date)
  createdAt: Date = new Date();
}

export class PostSchema implements IPost {
  @IsString({ message: 'ID must be a string' })
  @IsNotEmpty({ message: 'ID cannot be empty' })
  @IsUUID(4, { message: 'ID has incorrect format' })
  id: string = randomUUID();

  @Type(() => PostContentSchema)
  content: PostContentSchema;

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

  @IsDate({ message: 'UpdatedAt must be a valid date' })
  @Type(() => Date)
  updatedAt: Date = new Date();
}
