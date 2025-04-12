import { resolve } from 'path';
import { z } from 'zod';

export const configSchema = z.object({
  PORT: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),

  RABBIT_MQ_USERS_URL: z.string().nonempty(),
  RABBIT_MQ_USERS_EXCHANGE: z.string().nonempty(),
  RABBIT_MQ_USERS_QUEUE: z.string().nonempty(),

  RABBIT_MQ_POSTS_URL: z.string().nonempty(),
  RABBIT_MQ_POSTS_EXCHANGE: z.string().nonempty(),
  RABBIT_MQ_POSTS_QUEUE: z.string().nonempty(),

  JWT_KEY_PATH: z
    .string()
    .nonempty()
    .transform((value) => resolve(__dirname, '../../../../../', value)),

  JWT_ALG: z.string().nonempty(),
  JWT_CRV: z.string().nonempty(),
});

export type AppConfig = z.infer<typeof configSchema>;

export class Config implements AppConfig {
  static validate(config: Record<string, unknown>): AppConfig {
    return configSchema.parse(config);
  }

  private constructor(
    public readonly PORT: string,
    public readonly DATABASE_URL: string,

    public readonly RABBIT_MQ_USERS_URL: string,
    public readonly RABBIT_MQ_USERS_EXCHANGE: string,
    public readonly RABBIT_MQ_USERS_QUEUE: string,

    public readonly RABBIT_MQ_POSTS_URL: string,
    public readonly RABBIT_MQ_POSTS_EXCHANGE: string,
    public readonly RABBIT_MQ_POSTS_QUEUE: string,

    public readonly JWT_KEY_PATH: string,
    public readonly JWT_ALG: string,
    public readonly JWT_CRV: string,
  ) {}
}
