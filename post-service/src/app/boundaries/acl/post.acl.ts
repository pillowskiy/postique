import { PostEntity } from '@/domain/post';
import { AccessControlListResult } from './common';

export abstract class PostAccessControlList {
  public abstract canCreate(
    userId: string,
    post: PostEntity,
  ): AccessControlListResult;
  public abstract canModify(
    userId: string,
    post: PostEntity,
  ): AccessControlListResult;
  public abstract canDelete(
    userId: string,
    post: PostEntity,
  ): AccessControlListResult;
  public abstract canPublish(
    userId: string,
    post: PostEntity,
  ): AccessControlListResult;
  public abstract canArchive(
    userId: string,
    post: PostEntity,
  ): AccessControlListResult;
  public abstract canTransferOwnership(
    userId: string,
    post: PostEntity,
  ): AccessControlListResult;
  public abstract canChangeVisibility(
    userId: string,
    post: PostEntity,
  ): AccessControlListResult;
}
