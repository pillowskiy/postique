import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';
import { type IPostContent } from './content.interface';
import { Type } from 'class-transformer';
import { ParagraphSchema } from './paragraph/content-paragraph.schema';
import { IParagraph } from './paragraph/content-paragraph.interface';

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

  @IsArray()
  @IsArray({ message: 'Paragraphs must be a list of references' })
  @Type(() => ParagraphSchema)
  paragraphs: IParagraph<any>[] = [];

  @IsDate({ message: 'CreatedAt must be a valid date' })
  @Type(() => Date)
  createdAt: Date = new Date();
}
