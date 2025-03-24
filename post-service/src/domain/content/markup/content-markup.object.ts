import { EntityFactory } from '@/domain/common/entity';
import type {
  IMarkup,
  IncomingMarkup,
  MarkupType,
} from './content-markup.interface';
import { MarkupSchema } from './content-markup.schema';

export class Markup implements IMarkup {
  static create(markup: IncomingMarkup): Markup {
    const correctMarkup = EntityFactory.create(MarkupSchema, markup);
    return new Markup(correctMarkup);
  }

  public readonly type: MarkupType;
  public readonly start: number;
  public readonly end: number;
  public readonly href?: string;

  constructor(data: IMarkup) {
    this.type = data.type;
    this.start = data.start;
    this.end = data.end;
    this.href = data.href;
  }
}
