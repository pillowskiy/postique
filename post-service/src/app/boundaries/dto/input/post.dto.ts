export class CreatePostInput {
  constructor(
    public readonly title: string,
    public readonly visibility: string,
    public readonly description?: string,
    public readonly coverImage?: string,
  ) {}
}

export class UpdatePostMetadataInput {
  constructor(
    public readonly title?: string,
    public readonly description?: string,
    public readonly coverImage?: string,
  ) {}
}
