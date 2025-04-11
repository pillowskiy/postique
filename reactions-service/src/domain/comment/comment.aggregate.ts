import { UserEntity } from '../user';
import { CommentEntity } from './comment.entity';

export class CommentAggregate extends CommentEntity {
  static fromEntity(entity: CommentEntity): CommentAggregate {
    Object.setPrototypeOf(entity, CommentAggregate.prototype);
    return entity as CommentAggregate;
  }

  public author: Readonly<UserEntity>;

  setAuthor(author: UserEntity): void {
    this.author = author;
  }
}
