import { Module } from '@nestjs/common';
import { Transactional } from '@/app/boundaries/common';
import { AppConfigService } from '@/infrastructure/globals/config/config.service';
import {
  DrizzleConnection,
  DrizzlePostgresFactory,
} from './drizzle.connection';
import { DrizzleTransactional } from './drizzle.transactional';

@Module({
  providers: [
    {
      provide: DrizzleConnection,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const connectionString = configService.get('DATABASE_URL');
        return DrizzlePostgresFactory.create(connectionString);
      },
    },
    {
      provide: Transactional,
      useClass: DrizzleTransactional,
    },
  ],
  exports: [DrizzleConnection, Transactional],
})
export class DrizzleModule {}
