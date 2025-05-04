import { ParagraphAggregate } from '@/domain/content';
import { PostEntity } from '@/domain/post';

export class PostPublishedEvent {
  static fromEntity(
    post: PostEntity,
    content: ParagraphAggregate[],
  ): PostPublishedEvent {
    // TODO: Replace with domain method
    const rawContent = content.map((c) => c.text).join('\n');

    return new PostPublishedEvent(
      post.id,
      post.title,
      post.description,
      rawContent,
      post.coverImage,
      post.visibility,
      post.status,
    );
  }

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly content: string,
    public readonly coverImage: string | null,
    public readonly visibility: string,
    public readonly status: string,
  ) {}
}
