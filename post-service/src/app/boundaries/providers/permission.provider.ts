export enum Permission {
  CreatePost = 'create:posts',
  ModifyPost = 'modify:posts',
  DeletePost = 'delete:posts',
  ArchivePost = 'archive:posts',

  CreateSeries = 'create:series',
  ModifySeries = 'modify:series',
  DeleteSeries = 'delete:series',
}

export abstract class PermissionProvider {
  public abstract hasPermission(
    userId: string,
    permission: Permission,
  ): Promise<boolean>;
}
