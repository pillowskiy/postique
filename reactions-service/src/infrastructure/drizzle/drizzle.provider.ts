import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AppConfigService } from '@/infrastructure/globals/config/config.service';

export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    inject: [AppConfigService],
    useFactory: (configService: AppConfigService) => {
      const connectionString = configService.get('DATABASE_URL');
      const pool = new Pool({
        connectionString,
      });

      return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
    },
  },
];
