import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { ICodeMetadata, IImageMetadata } from './content-metadata.interface';

export class ImageMetadataSchema implements IImageMetadata {
  @IsString({ message: 'Source must be a string' })
  @IsNotEmpty({ message: 'Source cannot be empty' })
  @MaxLength(1024, { message: 'Source must be at most 1024 characters' })
  public readonly src: string;

  @IsNumber({}, { message: 'Original width must be a number' })
  @Min(0, { message: 'Original width must be a positive number' })
  public readonly originalWidth: number;

  @IsNumber({}, { message: 'Original height must be a number' })
  @Min(0, { message: 'Original height must be a positive number' })
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
