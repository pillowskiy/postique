import type { IncomingEntity } from '@/domain/common/entity';

export type IncomingImageMetadata = IncomingEntity<IImageMetadata>;

export interface IImageMetadata {
  src: string;
  originalWidth: number;
  originalHeight: number;
  alt?: string;
}

export type IncomingCodeMetadata = IncomingEntity<ICodeMetadata>;

export interface ICodeMetadata {
  lang: string;
  spellcheck: boolean;
}
