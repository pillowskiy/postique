export class Post {
  private _content: PostContent;

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

  get content(): PostContent {
    return this._content;
  }

  setContent(content: PostContent) {
    this._content = content;
  }
}

export class PostContent {
  private _paragraphs: PostParagraph[];

  constructor(
    public readonly title: string,
    public readonly description: string,
  ) {}

  get paragraphs(): PostParagraph[] {
    return this._paragraphs;
  }

  appendParagraph(paragraph: PostParagraph) {
    this._paragraphs.push(paragraph);
  }
}

export class PostParagraph {
  constructor(
    public readonly name: string,
    public readonly type: number,
    public readonly text: string,
    public readonly markups: PostMarkup[],
    public readonly metadata?: ImageMetadata,
    public readonly codeMetadata?: CodeMetadata,
  ) {}
}

export class PostMarkup {
  constructor(
    public readonly type: number,
    public readonly start: number,
    public readonly end: number,
  ) {}
}

export class ImageMetadata {
  constructor(
    public readonly id: string,
    public readonly originalWidth: number,
    public readonly originalHeight: number,
  ) {}
}

export class CodeMetadata {
  constructor(
    public readonly language: string,
    public readonly spellcheck: boolean,
  ) {}
}

export class CreatePostOutput {
  constructor(public readonly postId: string) {}
}

export class ArchivePostOutput {}

export class DeletePostOutput {
  constructor(public readonly postId: string) {}
}

export class TransferPostOwnershipOutput {}
