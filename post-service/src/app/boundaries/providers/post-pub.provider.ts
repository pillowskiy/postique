export class PostPayload {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly coverImage: string | null = null,
    public readonly visibility: string,
    public readonly status: string,
  ) {}
}

export abstract class PostPublisher {
  abstract publishCreated(post: PostPayload): Promise<void>;
  abstract publishModified(post: PostPayload): Promise<void>;
}
