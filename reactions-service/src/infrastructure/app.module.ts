import { Module } from '@nestjs/common';
import { AppConfigModule } from './globals/config/config.module';

@Module({
  imports: [AppConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
