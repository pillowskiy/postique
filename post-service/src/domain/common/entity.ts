import { validateSync } from 'class-validator';

export type IncomingEntity<
  E extends Record<string, any>,
  P extends Partial<Record<keyof E | string, any>>,
> = Partial<Omit<E, keyof P> & P>;

export class EntityFactory {
  public static create<
    I extends IncomingEntity<object, any>,
    E = I extends IncomingEntity<infer T, any> ? T : never,
  >(schema: new () => E extends object ? E : never, input: I): E {
    const _schema = new schema();
    Object.assign(_schema, input);
    const errors = validateSync(_schema, {
      whitelist: true,
      stopAtFirstError: true,
    });

    if (errors?.length > 0) {
      const formatted = errors.map((e) => {
        const constraint = Object.values(e.constraints ?? []).at(0);
        const message = constraint ?? 'Unknown constraint';
        return message;
      });

      throw new Error(formatted.join('. '));
    }

    return _schema;
  }
}
