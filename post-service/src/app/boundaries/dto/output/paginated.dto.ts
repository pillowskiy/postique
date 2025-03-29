export class PaginatedOutput<T> {
  static empty<T>(): PaginatedOutput<T> {
    return new PaginatedOutput<T>([], 0, 1);
  }

  constructor(
    public readonly items: T[],
    public readonly total: number,
    public readonly page: number,
  ) {}
}
