import { PostEntity } from '../post/post.entity';
import { BookmarkEntity } from './bookmark.entity';

export class BookmarkAggregate extends BookmarkEntity {
  static fromEntity(entity: BookmarkEntity): BookmarkAggregate {
    Object.setPrototypeOf(entity, BookmarkAggregate.prototype);
    return entity as BookmarkAggregate;
  }

  public post: Readonly<PostEntity>;

  setPost(post: PostEntity): void {
    this.post = post;
  }
}
