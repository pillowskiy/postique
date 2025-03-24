import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDate,
  MaxLength,
  IsUUID,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { type IPost, PostStatus, PostVisibility } from './post.interface';
import { Type } from 'class-transformer';
import { randomUUID } from 'crypto';

export class PostSchema implements IPost {
  @IsString({ message: 'ID must be a string' })
  @IsNotEmpty({ message: 'ID cannot be empty' })
  @IsUUID(4, { message: 'ID has incorrect format' })
  id: string = randomUUID();

  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  @MaxLength(128, { message: 'Title must be at most 128 characters' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(512, { message: 'Description must be at most 256 characters' })
  description: string;

  @IsString({ message: 'Owner must be a string' })
  @IsNotEmpty({ message: 'Owner cannot be empty' })
  owner: string;

  @MaxLength(128, { message: 'Slug must be at most 128 characters' })
  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug cannot be empty' })
  slug: string;

  @IsEnum(PostStatus, { message: 'Invalid post status' })
  status: PostStatus = PostStatus.Draft;

  @IsEnum(PostVisibility, { message: 'Invalid post visibility' })
  visibility: PostVisibility = PostVisibility.Public;

  @IsArray({ message: 'Post authors must be a list of references' })
  @ArrayNotEmpty({ message: 'Post must have at least one author' })
  @IsUUID('4', {
    each: true,
    message: 'Post author reference has incorrect format',
  })
  authors: Readonly<string[]> = [];

  @IsOptional()
  @IsDate({ message: 'PublishedAt must be a valid date or null' })
  @Type(() => Date)
  publishedAt: Date | null = null;

  @IsDate({ message: 'CreatedAt must be a valid date' })
  @Type(() => Date)
  createdAt: Date = new Date();

  @IsString({ message: 'Content must be a reference' })
  @IsNotEmpty({ message: 'Content cannot be empty' })
  @IsUUID(4, { message: 'Content has incorrect format' })
  content: string = randomUUID();

  @IsDate({ message: 'UpdatedAt must be a valid date' })
  @Type(() => Date)
  updatedAt: Date = new Date();
}
