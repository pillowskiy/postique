import { DetailedPostOutput, PostOutput } from '@/app/boundaries/dto/output';
import { ParagraphAggregate } from '@/domain/content';
import { PostEntity } from '@/domain/post';
import { ParagraphMapper } from './paragraph.mapper';

export class PostMapper {
  static toDto(post: PostEntity): PostOutput {
    const postDto = new PostOutput(
      post.id,
      post.title,
      post.description,
      post.visibility,
      post.owner,
      [...post.authors],
      post.slug,
      post.status,
      post.publishedAt,
      post.createdAt,
      post.updatedAt,
    );

    return postDto;
  }

  static toDetailedDto(
    post: PostEntity,
    paragraphs?: ParagraphAggregate[],
  ): DetailedPostOutput {
    const postParagraphs = (paragraphs ?? []).map((p) =>
      ParagraphMapper.toDto(p),
    );

    const postDto = new DetailedPostOutput(
      post.id,
      post.title,
      post.description,
      post.visibility,
      post.owner,
      [...post.authors],
      post.slug,
      post.status,
      post.publishedAt,
      post.createdAt,
      post.updatedAt,
      postParagraphs,
    );

    return postDto;
  }
}
