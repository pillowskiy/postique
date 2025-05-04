import { Type } from 'class-transformer';
import {
  IsEnum,
  IsString,
  IsArray,
  IsObject,
  IsOptional,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { ParagraphType, IParagraph } from './content-paragraph.interface';
import {
  ImageMetadataSchema,
  CodeMetadataSchema,
} from '../metadata/content-metadata.schema';
import { MarkupSchema } from '../markup/content-markup.schema';
import { randomUUID } from 'crypto';

export class ParagraphSchema<T extends ParagraphType> implements IParagraph {
  @IsString({ message: 'ID must be a string' })
  @IsNotEmpty({ message: 'ID cannot be empty' })
  @IsUUID(4, { message: 'ID has incorrect format' })
  public readonly id: string = randomUUID();

  @IsEnum(ParagraphType, { message: 'Invalid paragraph type' })
  public readonly type: T;

  @IsString({ message: 'Text must be a string' })
  public readonly text: string;

  @IsArray({ message: 'Markups must be a list of references' })
  @Type(() => MarkupSchema)
  public readonly markups: MarkupSchema[];

  @IsOptional()
  @IsObject()
  @Type(() => ImageMetadataSchema)
  public readonly metadata: T extends ParagraphType.Figure
    ? ImageMetadataSchema
    : never;

  @IsOptional()
  @IsObject()
  @Type(() => CodeMetadataSchema)
  public readonly codeMetadata: T extends ParagraphType.Code
    ? CodeMetadataSchema
    : never;
}
