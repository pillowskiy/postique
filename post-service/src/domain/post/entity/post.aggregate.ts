import { EntityFactory } from '../../common/entity';
import { PostEntity } from './post.entity';
import { IDetailedPost, IncomingPost, IPost } from './post.interface';
import { PostSchema } from './post.schema';
import { UserEntity } from '@/domain/user';

export class PostAggregate extends PostEntity implements IDetailedPost {
  static create(post: IncomingPost): PostAggregate {
    const validPost = EntityFactory.create(PostSchema, post);
    return new PostAggregate(validPost);
  }

  private _ownerRef: UserEntity | null = null;

  private constructor(post: IPost) {
    super(post);
  }

  get ownerRef(): UserEntity {
    if (!this._ownerRef) {
      throw new Error('Post owner is not set');
    }

    return this._ownerRef;
  }

  setOwner(owner: UserEntity) {
    this._ownerRef = owner;
    this._owner = owner.id;
  }
}
