import { PermissionProvider } from '@/app/boundaries/providers';
import { AppConfigService } from '@/infrastructure/globals/config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SSOPermissionProvider } from './permission.service';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PERMISSION_PACKAGE',
        useFactory: (configService: AppConfigService) => {
          return {
            transport: Transport.GRPC,
            options: {
              package: SSOPermissionProvider.package,
              protoPath: join(
                configService.get('PROTO_PATH'),
                'v1',
                'sso',
                'permission.proto',
              ),
              url: configService.get('SSO_URL'),
            },
          };
        },
        inject: [AppConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: PermissionProvider,
      useClass: SSOPermissionProvider,
    },
  ],
  exports: [PermissionProvider],
})
export class PermissionModule {}
