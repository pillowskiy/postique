import { EntityFactory, IncomingEntity } from '../common/entity';
import { PostSchema } from './post.schema';

export class PostEntity {
  static create(input: IncomingEntity<PostEntity>): PostEntity {
    const validPost = EntityFactory.create(PostSchema, input);
    return new PostEntity(
      validPost.id,
      validPost.title,
      validPost.description,
      validPost.coverImage,
    );
  }

  protected constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly coverImage: string | null = null,
  ) {}
}
