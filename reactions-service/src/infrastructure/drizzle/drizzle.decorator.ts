import { Inject } from '@nestjs/common';
import { DrizzleConnection } from './drizzle.connection';

export const InjectConnection = () => Inject(DrizzleConnection);
