import { ViewAccessControlList } from '@/app/boundaries/acl';
import { Module } from '@nestjs/common';
import { ViewAccessControlListProvider } from './view-acl.provider';

@Module({
  providers: [
    {
      provide: ViewAccessControlList,
      useClass: ViewAccessControlListProvider,
    },
  ],
  exports: [ViewAccessControlList],
})
export class ViewAccessControlListModule {}
