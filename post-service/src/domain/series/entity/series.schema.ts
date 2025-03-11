import {
  IsUUID,
  IsString,
  Length,
  IsOptional,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { IPostSeries } from './series.interface';

export class PostSeriesSchema implements IPostSeries {
  @IsUUID('4', { message: 'id must be a valid UUID v4' })
  id: string;

  @IsString({ message: 'Series title must be a string' })
  @Length(2, 256, {
    message: 'Series title must be between 2 and 256 characters',
  })
  title: string;

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

  @IsArray({ message: 'Series posts must be an array' })
  @ArrayNotEmpty({ message: 'Series posts cannot be empty' })
  @IsUUID('4', {
    each: true,
    message: 'Series post must be a valid UUID v4',
  })
  posts: Readonly<string[]>;
}
