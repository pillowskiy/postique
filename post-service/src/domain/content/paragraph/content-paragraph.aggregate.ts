import {
  type IncomingParagraph,
  type IParagraph,
  ParagraphType,
} from './content-paragraph.interface';
import { Markup } from '../markup';
import { CodeMetadata, ImageMetadata } from '../metadata';
import { ParagraphSchema } from './content-paragraph.schema';
import { EntityFactory } from '@/domain/common/entity';

export class Paragraph<T extends ParagraphType> implements IParagraph<T> {
  static create(data: IncomingParagraph): Paragraph<any> {
    const validParagraph = EntityFactory.create(ParagraphSchema, data);
    return new Paragraph(validParagraph);
  }

  public readonly name: string;
  public readonly type: T;
  public readonly text: string;
  public markups: Markup[];
  public metadata: T extends ParagraphType.Figure ? ImageMetadata : never;
  public codeMetadata: T extends ParagraphType.Code ? CodeMetadata : never;

  constructor(data: IParagraph<T>) {
    this.name = data.name;
    this.type = data.type;
    this.text = data.text;
    this.markups = data.markups.map((m) => Markup.create(m));

    if (data.metadata) {
      (this as Paragraph<ParagraphType.Figure>).metadata = ImageMetadata.create(
        data.metadata,
      );
    }

    if (data.codeMetadata) {
      (this as Paragraph<ParagraphType.Code>).codeMetadata =
        CodeMetadata.create(data.codeMetadata);
    }
  }

  appendMarkup(markup: Markup, index: number): void {
    if (index < 0 || index > this.markups.length) {
      throw new Error('Index out of range');
    }

    this.markups.splice(index, 0, markup);
  }
}
