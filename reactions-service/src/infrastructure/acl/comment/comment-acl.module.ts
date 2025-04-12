import { CommentAccessControlList } from '@/app/boundaries/acl';
import { Module } from '@nestjs/common';
import { CommentAccessControlListProvider } from './comment-acl.provider';

@Module({
  providers: [
    {
      provide: CommentAccessControlList,
      useClass: CommentAccessControlListProvider,
    },
  ],
  exports: [CommentAccessControlList],
})
export class CommentAccessControlListModule {}
