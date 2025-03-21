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

export type IncomingParagraph = IncomingEntity<IParagraph, { type: number }>;

export interface IParagraph {
  name: string;
  type: ParagraphType;
  text: string;
  markups: IMarkup[];
  metadata: IImageMetadata | undefined;
  codeMetadata: ICodeMetadata | undefined;
}
