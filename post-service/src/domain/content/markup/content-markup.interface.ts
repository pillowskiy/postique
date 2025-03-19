import { IncomingEntity } from '@/domain/common/entity';

export enum MarkupType {
  Bold,
  Italic,
  Underline,
  Strike,
  Code,
  Link,
  Anchor,
  Image,
  Video,
  Quote,
  NewLine,
}

export type IncomingMarkup = IncomingEntity<IMarkup, { type: number }>;

export interface IMarkup {
  type: MarkupType;
  href?: string | undefined;
  start: number;
  end: number;
}
