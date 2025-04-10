import { Inject } from '@nestjs/common';
import { DrizzleAsyncProvider } from './drizzle.provider';

export const InjectConnection = () => Inject(DrizzleAsyncProvider);
