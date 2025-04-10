import { Module } from '@nestjs/common';
import { AppConfigModule } from '@/infrastructure/globals/config';
import { DrizzleModule } from './drizzle';

@Module({
  imports: [AppConfigModule, DrizzleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
