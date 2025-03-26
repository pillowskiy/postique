import { Module } from '@nestjs/common';
import { PostsModule } from './posts';
import { PreferencesModule } from './preferences';
import { SeriesModule } from './series/series.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PostsModule, PreferencesModule, SeriesModule, UsersModule],
})
export class ComponentsModule {}
