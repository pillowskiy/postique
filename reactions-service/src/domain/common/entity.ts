import { DomainInvariantViolation } from './error';

export type IncomingEntity<
  E extends Record<string, any>,
  P extends Partial<Record<keyof E | string, any>> = object,
> = Partial<
  Omit<
    {
      [K in keyof E]: E[K] extends (...args: any[]) => any
        ? never
        : E[K] extends { call: any } | CallableFunction
          ? never
          : K;
    }[keyof E],
    keyof P
  >
> &
  P;

export class EntityFactory {
  public static create<
    I extends IncomingEntity<object, any>,
    E = I extends IncomingEntity<infer T, any> ? T : never,
  >(schema: Zod.ZodSchema<E>, input: I): E {
    const res = schema.safeParse(input);

    if (!res.success) {
      const formatted = res.error.errors.reduce(
        (acc, issue) => {
          const key = issue.path.join('.');
          acc[key] = issue.message;
          return acc;
        },
        {} as Record<string, string>,
      );

      throw new DomainInvariantViolation('Failed to create entity', formatted);
    }

    return res.data;
  }
}
