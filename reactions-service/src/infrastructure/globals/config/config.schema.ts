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
  ) {}
}
