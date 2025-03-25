import { Module } from '@nestjs/common';
import { PostsModule } from './posts';
import { PreferencesModule } from './preferences';
import { SeriesModule } from './series/series.module';

@Module({
  imports: [PostsModule, PreferencesModule, SeriesModule],
})
export class ComponentsModule {}
