import { EntityFactory } from '@/domain/common/entity';
import { DomainBusinessRuleViolation } from '@/domain/common/error';
import { Markup } from '../markup';
import { CodeMetadata, ImageMetadata } from '../metadata';
import {
  type IncomingParagraph,
  type IParagraph,
  ParagraphType,
} from './content-paragraph.interface';
import { ParagraphSchema } from './content-paragraph.schema';

export class ParagraphAggregate<T extends ParagraphType = ParagraphType>
  implements IParagraph
{
  static create(data: IncomingParagraph): ParagraphAggregate {
    const validParagraph = EntityFactory.create(ParagraphSchema, data);
    return new ParagraphAggregate(validParagraph);
  }

  public readonly id: string;
  public readonly type: T;
  public readonly text: string;
  public markups: Markup[];
  public metadata: T extends ParagraphType.Figure ? ImageMetadata : undefined;
  public codeMetadata: T extends ParagraphType.Code ? CodeMetadata : undefined;

  private constructor(data: IParagraph) {
    this.id = data.id;
    this.type = data.type as T;
    this.text = data.text;
    this.markups = data.markups.map((m) => Markup.create(m));

    if (data.metadata) {
      (this as ParagraphAggregate<ParagraphType.Figure>).metadata =
        ImageMetadata.create(data.metadata);
    }

    if (data.codeMetadata) {
      (this as ParagraphAggregate<ParagraphType.Code>).codeMetadata =
        CodeMetadata.create(data.codeMetadata);
    }
  }

  appendMarkup(markup: Markup): void {
    if (this.markups.length > 50) {
      throw new DomainBusinessRuleViolation(
        `The max size of the paragraph markups exceed, max size is 50 markups per paragraph`,
      );
    }

    this.markups.push(markup);
  }
}
