export class CursorOutput<T> {
  constructor(
    public readonly items: T[],
    public readonly cursorField: string | Date | null,
    public readonly size: number,
  ) {}
}
