export type CursorSupportedField<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends string | Date ? K : never;
}[keyof T];

export class CursorEntity<T extends Record<string, any>> {
  private _cursor: string | Date | null = null;
  private _items: T[] = [];

  constructor(public readonly cursorField: CursorSupportedField<T>) {}

  get cursor(): string | Date | null {
    return this._cursor;
  }

  get items(): Readonly<T[]> {
    return this._items;
  }

  get size(): number {
    return this._items.length;
  }

  append(entity: T) {
    this._cursor = entity[this.cursorField] ?? null;
    this._items.push(entity);
  }
}
