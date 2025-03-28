import { Module } from '@nestjs/common';
import { PostAccessControlList } from '@/app/boundaries/acl';
import { PermissionModule } from '@/infrastructure/service/permission';
import { PostAccessControlListProvider } from './post-acl.provider';

@Module({
  imports: [PermissionModule],
  providers: [
    {
      provide: PostAccessControlList,
      useClass: PostAccessControlListProvider,
    },
  ],
  exports: [PostAccessControlList],
})
export class PostAccessControlListModule {}
