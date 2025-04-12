import { BookmarkCollectionAccessControlList } from '@/app/boundaries/acl';
import { Module } from '@nestjs/common';
import { BookmarkCollectionAccessControlListProvider } from './collection-acl.provider';

@Module({
  providers: [
    {
      provide: BookmarkCollectionAccessControlList,
      useClass: BookmarkCollectionAccessControlListProvider,
    },
  ],
  exports: [BookmarkCollectionAccessControlList],
})
export class BookmarkCollectionAccessControlListModule {}
