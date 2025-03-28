import { Module } from '@nestjs/common';
import { SeriesAccessControlList } from '@/app/boundaries/acl';
import { PermissionModule } from '@/infrastructure/service/permission';
import { SeriesAccessControlListProvider } from './series-acl.provider';

@Module({
  imports: [PermissionModule],
  providers: [
    {
      provide: SeriesAccessControlList,
      useClass: SeriesAccessControlListProvider,
    },
  ],
  exports: [SeriesAccessControlList],
})
export class SeriesAccessControlListModule {}
