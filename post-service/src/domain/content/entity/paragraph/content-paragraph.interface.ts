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
  Title,
}

export type IncomingParagraph = IncomingEntity<IParagraph, { type: number }>;

export interface IParagraph {
  id: string;
  type: ParagraphType;
  text: string;
  markups: IMarkup[];
  metadata?: IImageMetadata;
  codeMetadata?: ICodeMetadata;
}
