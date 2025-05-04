import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
  Min,
} from 'class-validator';
import { DeltaType, IDelta } from './delta.interface';
import { IParagraph } from '../paragraph/content-paragraph.interface';

export class DeltaSchema implements IDelta {
  @IsNotEmpty({ message: 'Type must be a number' })
  @IsEnum(DeltaType, { message: 'Invalid delta type' })
  type: DeltaType;

  @IsNotEmpty({ message: 'Index must be a number' })
  @IsNumber({ allowNaN: false }, { message: 'Index must be a number' })
  @Min(0, { message: 'Index must be a positive number' })
  index: number;

  @IsNotEmpty({ message: 'Paragraph must be a reference' })
  @IsObject()
  @IsObject({ message: 'Paragraph must be a reference' })
  paragraph: IParagraph;
}
