import { Module } from '@nestjs/common';
import { PreferencesAccessControlListProvider } from './preferences-acl.provider';
import { PreferencesAccessControlList } from '@/app/boundaries/acl';

@Module({
  imports: [],
  providers: [
    {
      provide: PreferencesAccessControlList,
      useClass: PreferencesAccessControlListProvider,
    },
  ],
  exports: [PreferencesAccessControlList],
})
export class PreferencesAccessControlListModule {}
