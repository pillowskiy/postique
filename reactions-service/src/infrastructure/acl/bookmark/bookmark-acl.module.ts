import { BookmarkAccessControlList } from '@/app/boundaries/acl';
import { Module } from '@nestjs/common';
import { BookmarkAccessControlListProvider } from './bookmark-acl.provider';

@Module({
  providers: [
    {
      provide: BookmarkAccessControlList,
      useClass: BookmarkAccessControlListProvider,
    },
  ],
  exports: [BookmarkAccessControlList],
})
export class BookmarkAccessControlListModule {}
