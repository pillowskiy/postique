import {
  IsUUID,
  IsString,
  Length,
  IsOptional,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { IPostSeries, PostSeriesVisibility } from './series.interface';
import { randomUUID } from 'crypto';

export class PostSeriesSchema implements IPostSeries {
  @IsUUID('4', { message: 'Series id must be a valid UUID v4' })
  id: string = randomUUID();

  @IsString({ message: 'Series title must be a string' })
  @Length(2, 256, {
    message: 'Series title must be between 2 and 256 characters',
  })
  title: string;

  @IsUUID('4', { message: 'Series owner must be a valid reference' })
  owner: string;

  @IsNotEmpty({ message: 'Visibility cannot be empty' })
  @IsString({ message: 'Visibility must be a string' })
  @IsEnum(PostSeriesVisibility, {
    message: 'Visibility must be one of the following values',
  })
  visibility: PostSeriesVisibility = PostSeriesVisibility.Public;

  @IsString({ message: 'Series slug must be a string' })
  @Length(2, 256, {
    message: 'Series slug must be between 2 and 256 characters',
  })
  slug: string;

  @IsOptional()
  @IsString({ message: 'Series description must be a string' })
  @MaxLength(1024, {
    message: 'Series description cannot be longer than 1024 characters',
  })
  description: string = '';

  @IsUUID('4', {
    each: true,
    message: 'Series post must be a reference',
  })
  @ArrayNotEmpty({ message: 'Series posts cannot be empty' })
  @IsArray({ message: 'Series posts must be an array' })
  posts: Readonly<string[]>;
}
