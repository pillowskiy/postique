export class Delta {
  constructor(
    public readonly paragraph: Paragraph,
    public readonly index: number,
    public readonly type: number,
  ) {}
}

export class Paragraph {
  constructor(
    public readonly id: string,
    public readonly type: number,
    public readonly text: string,
    public readonly markups: Markup[],
    public readonly metadata?: ImageMetadata,
    public readonly codeMetadata?: CodeMetadata,
  ) {}
}

export class Markup {
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
    public readonly lang: string,
    public readonly spellcheck: boolean,
  ) {}
}
