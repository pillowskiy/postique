import { IncomingEntity } from '@/domain/common/entity';
import type { IMarkup } from '../markup';
import type { ICodeMetadata, IImageMetadata } from '../metadata';

export enum ParagraphType {
  Text,
  Code,
  Figure,
  Quote,
  UnorderedList,
  OrderedList,
  Heading,
}

export type IncomingParagraph = IncomingEntity<IParagraph<any>, {}>;

export interface IParagraph<T extends ParagraphType> {
  name: string;
  type: T;
  text: string;
  markups: IMarkup[];
  metadata: T extends ParagraphType.Figure ? IImageMetadata : never;
  codeMetadata: T extends ParagraphType.Code ? ICodeMetadata : never;
}
