import { Inject, Injectable } from '@nestjs/common';
import { PostAccessControlList } from '@/app/boundaries/acl';
import { PostEntity } from '@/domain/post';
import { Permission, PermissionProvider } from '@/app/boundaries/providers';

@Injectable()
export class PostAccessControlListProvider extends PostAccessControlList {
  @Inject(PermissionProvider)
  private readonly _permissionProvider: PermissionProvider;

  public async canCreate(userId: string, post: PostEntity): Promise<boolean> {
    const isOwner = this._isOwner(userId, post);

    const hasPermission = await this._permissionProvider.hasPermission(
      userId,
      Permission.CreatePost,
    );

    return isOwner && hasPermission;
  }

  public async canModify(userId: string, post: PostEntity): Promise<boolean> {
    const isOwner = this._isOwner(userId, post);
    const isAuthor = this._isAuthor(userId, post);
    const isCreator = isOwner || isAuthor;

    if (isCreator) {
      return true;
    }

    const hasPermission = await this._permissionProvider.hasPermission(
      userId,
      Permission.ModifyPost,
    );

    return hasPermission;
  }

  public async canDelete(userId: string, post: PostEntity): Promise<boolean> {
    const isOwner = this._isOwner(userId, post);

    if (isOwner) {
      return true;
    }

    const hasPermission = await this._permissionProvider.hasPermission(
      userId,
      Permission.DeletePost,
    );

    return hasPermission;
  }

  public canPublish(userId: string, post: PostEntity): boolean {
    return this._isOwner(userId, post);
  }

  public async canArchive(userId: string, post: PostEntity): Promise<boolean> {
    const isOwner = this._isOwner(userId, post);
    if (isOwner) {
      return true;
    }

    const hasPermission = await this._permissionProvider.hasPermission(
      userId,
      Permission.ArchivePost,
    );

    return hasPermission;
  }

  public canTransferOwnership(userId: string, post: PostEntity): boolean {
    return this._isOwner(userId, post);
  }

  public canChangeVisibility(userId: string, post: PostEntity): boolean {
    return this._isOwner(userId, post);
  }

  private _isOwner(userId: string, post: PostEntity): boolean {
    return userId === post.owner;
  }

  private _isAuthor(userId: string, post: PostEntity): boolean {
    return post.authors.includes(userId);
  }
}
