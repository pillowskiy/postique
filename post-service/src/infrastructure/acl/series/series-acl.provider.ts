import { AccessControlListResult } from '@/app/boundaries/acl/common';
import { SeriesAccessControlList } from '@/app/boundaries/acl';
import { Permission, PermissionProvider } from '@/app/boundaries/providers';
import { PostSeriesEntity } from '@/domain/series';
import { Inject } from '@nestjs/common';

export class SeriesAccessControlListProvider extends SeriesAccessControlList {
  @Inject(PermissionProvider)
  private readonly _permissionProvider: PermissionProvider;

  async canCreate(userId: string, series: PostSeriesEntity): Promise<boolean> {
    const isOwner = this._isOwner(userId, series);
    const hasPermission = await this._permissionProvider.hasPermission(
      userId,
      Permission.CreateSeries,
    );

    return isOwner && hasPermission;
  }

  async canModify(userId: string, series: PostSeriesEntity): Promise<boolean> {
    const isOwner = this._isOwner(userId, series);
    const isCreator = isOwner;

    if (isCreator) {
      return true;
    }

    const hasPermission = await this._permissionProvider.hasPermission(
      userId,
      Permission.ModifySeries,
    );

    return hasPermission;
  }

  async canDelete(userId: string, series: PostSeriesEntity): Promise<boolean> {
    const isOwner = this._isOwner(userId, series);
    const isCreator = isOwner;

    if (isCreator) {
      return true;
    }

    const hasPermission = await this._permissionProvider.hasPermission(
      userId,
      Permission.DeleteSeries,
    );

    return hasPermission;
  }

  private _isOwner(userId: string, series: PostSeriesEntity): boolean {
    return userId === series.owner;
  }
}
