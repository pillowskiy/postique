export enum Permission {
  CreatePost = 'create:posts',
  ModifyPost = 'modify:posts',
  DeletePost = 'delete:posts',
}

export abstract class PermissionProvider {
  public abstract hasPermission(
    userId: string,
    permission: Permission,
  ): Promise<boolean>;
}
