export class Post {
  public readonly content: PostContent;
  constructor(
    public readonly id: string,
    title: string,
    description: string,
    content: string,
    public readonly visibility: string,
    public readonly owner: string,
    public readonly authors: string[],
    public readonly slug: string,
    public readonly status: string,
    public readonly publishedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.content = new PostContent(title, description, content);
  }
}

export class PostContent {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly content: string,
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
