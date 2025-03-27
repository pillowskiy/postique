import { Logger } from '@/app/boundaries/common';
import { Permission, PermissionProvider } from '@/app/boundaries/providers';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PermissionClient, protobufPackage } from '@pb/v1/sso/permission.pb';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SSOPermissionProvider extends PermissionProvider {
  static package = protobufPackage;

  private _permClient: PermissionClient;

  @Inject('PERMISSION_PACKAGE')
  private _client: ClientGrpc;

  @Inject(Logger)
  private readonly _logger: Logger;

  onModuleInit() {
    this._permClient = this._client.getService<PermissionClient>('Permission');

    this._logger.debug?.('Permission service initialized');
    this._logger.debug?.('Syncing permissions');

    firstValueFrom(
      this._permClient.syncPermissions({
        names: Object.values(Permission),
      }),
    )
      .then(() => {
        this._logger.debug?.('Permissions synced successfully');
      })
      .catch((err) => {
        this._logger.error?.('Failed to sync permissions', err);
      });
  }

  public async hasPermission(
    userId: string,
    permission: Permission,
  ): Promise<boolean> {
    return firstValueFrom(
      this._permClient.hasUserPermission({
        userId,
        name: permission,
      }),
    ).then((res) => res.hasPermission);
  }
}
