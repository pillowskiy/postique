import { EntityFactory } from '@/domain/common/entity';
import type {
  ICodeMetadata,
  IImageMetadata,
  IncomingCodeMetadata,
  IncomingImageMetadata,
} from './content-metadata.interface';
import {
  CodeMetadataSchema,
  ImageMetadataSchema,
} from './content-metadata.schema';

export class ImageMetadata implements IImageMetadata {
  static create(metadata: IncomingImageMetadata): ImageMetadata {
    const correctMetadata = EntityFactory.create(ImageMetadataSchema, metadata);
    return new ImageMetadata(correctMetadata);
  }

  public readonly src: string;
  public readonly originalWidth: number;
  public readonly originalHeight: number;
  public readonly alt?: string;

  constructor(data: IImageMetadata) {
    this.src = data.src;
    this.originalWidth = data.originalWidth;
    this.originalHeight = data.originalHeight;
    this.alt = data.alt;
  }
}

export class CodeMetadata implements ICodeMetadata {
  static create(metadata: IncomingCodeMetadata): CodeMetadata {
    const correctMetadata = EntityFactory.create(CodeMetadataSchema, metadata);
    return new CodeMetadata(correctMetadata);
  }

  public readonly lang: string;
  public readonly spellcheck: boolean;

  constructor(data: ICodeMetadata) {
    this.lang = data.lang;
    this.spellcheck = data.spellcheck ?? false;
  }
}
