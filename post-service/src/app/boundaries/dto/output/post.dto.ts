export class PostOutput {
  constructor(
    public readonly id: string,
    public readonly visibility: string,
    public readonly owner: string,
    public readonly authors: string[],
    public readonly slug: string,
    public readonly status: string,
    public readonly publishedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export class DetailedPostOutput implements PostOutput {
  constructor(
    public readonly id: string,
    public readonly visibility: string,
    public readonly owner: string,
    public readonly authors: string[],
    public readonly slug: string,
    public readonly status: string,
    public readonly publishedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly paragraphs: PostParagraphOutput[],
  ) {}
}

export class PostParagraphOutput {
  constructor(
    public readonly name: string,
    public readonly type: number,
    public readonly text: string,
    public readonly markups: PostMarkupOutput[],
    public readonly metadata?: ImageMetadataOutput,
    public readonly codeMetadata?: CodeMetadataOutput,
  ) {}
}

export class PostMarkupOutput {
  constructor(
    public readonly type: number,
    public readonly start: number,
    public readonly end: number,
    public readonly href?: string,
  ) {}
}

export class ImageMetadataOutput {
  constructor(
    public readonly src: string,
    public readonly originalWidth: number,
    public readonly originalHeight: number,
  ) {}
}

export class CodeMetadataOutput {
  constructor(
    public readonly language: string,
    public readonly spellcheck: boolean,
  ) {}
}

export class CreatePostOutput {
  constructor(public readonly postId: string) {}
}

export class ArchivePostOutput {
  constructor(public readonly postId: string) {}
}

export class DeletePostOutput {
  constructor(public readonly postId: string) {}
}

export class TransferPostOwnershipOutput {
  constructor(public readonly postId: string) {}
}
