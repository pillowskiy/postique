export class Paginated<T> {
  constructor(
    public readonly items: T[],
    public readonly total: number,
    public readonly page: number,
  ) {}
}
