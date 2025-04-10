import { z } from 'zod';

export const configSchema = z.object({
  PORT: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
});

export type AppConfig = z.infer<typeof configSchema>;

export class Config implements AppConfig {
  static validate(config: Record<string, unknown>): AppConfig {
    return configSchema.parse(config);
  }

  private constructor(
    public readonly PORT: string,
    public readonly DATABASE_URL: string,
  ) {}
}
