import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsDefined,
  IsUrl,
} from 'class-validator';
import { MarkupType, IMarkup } from './content-markup.interface';

export class MarkupSchema implements IMarkup {
  @IsEnum(MarkupType, { message: 'Invalid markup type' })
  public readonly type: MarkupType;

  @IsOptional()
  @IsString({ message: 'Href must be a string' })
  @IsUrl(
    { protocols: ['http', 'https'] },
    { message: 'Href must be a valid URL' },
  )
  public readonly href?: string;

  @IsNumber({ allowNaN: false }, { message: 'Start must be a number' })
  @IsDefined({ message: 'Start is required' })
  public readonly start: number;

  @IsNumber({}, { message: 'End must be a number' })
  @IsDefined({ message: 'End is required' })
  public readonly end: number;
}
