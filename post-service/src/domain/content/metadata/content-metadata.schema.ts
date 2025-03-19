import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ICodeMetadata, IImageMetadata } from './content-metadata.interface';

export class ImageMetadataSchema implements IImageMetadata {
  @IsString({ message: 'ID must be a string' })
  @MinLength(1, { message: 'ID must be at least 1 character long' })
  @MaxLength(64, { message: 'ID must be at most 64 characters long' })
  public readonly id: string;

  @IsNumber({}, { message: 'Original width must be a number' })
  @Min(1, { message: 'Original width must be greater than 0' })
  public readonly originalWidth: number;

  @IsNumber({}, { message: 'Original height must be a number' })
  @Min(1, { message: 'Original height must be greater than 0' })
  public readonly originalHeight: number;

  @IsOptional()
  @IsString({ message: 'Alt text must be a string' })
  public readonly alt?: string;
}

export class CodeMetadataSchema implements ICodeMetadata {
  @IsString({ message: 'Language must be a string' })
  public readonly lang: string = 'md';

  @IsBoolean({ message: 'Spellcheck must be a boolean' })
  public readonly spellcheck: boolean = false;
}
