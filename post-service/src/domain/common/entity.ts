import { validateSync } from 'class-validator';
import { DomainInvariantViolation } from './error';
import { plainToInstance } from 'class-transformer';

export type IncomingEntity<
  E extends Record<string, any>,
  P extends Partial<Record<keyof E | string, any>> = object,
> = Partial<Omit<E, keyof P> & P>;

export class EntityFactory {
  public static create<
    I extends IncomingEntity<object, any>,
    E = I extends IncomingEntity<infer T, any> ? T : never,
  >(schema: new () => E extends object ? E : never, input: I): E {
    const instance = plainToInstance(schema, input);
    if (typeof instance !== 'object') {
      throw new DomainInvariantViolation('Failed to create entity', {
        default: 'Instance is not an object',
      });
    }

    const errors = validateSync(instance, {
      whitelist: true,
      stopAtFirstError: true,
    });

    if (errors?.length > 0) {
      const formatted = errors.reduce(
        (prev, curr) => {
          const constraint = Object.values(curr.constraints ?? []).at(0);
          const message = constraint ?? 'Unknown constraint';
          prev[curr.property] = message;
          return prev;
        },
        {} as Record<string, string>,
      );

      throw new DomainInvariantViolation('Failed to create entity', formatted);
    }

    return instance;
  }
}
