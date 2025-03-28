export class ArrayUtils {
  static fromSetWithOffset<T>(
    set: Set<T>,
    offset: number,
    limit: number = -1,
  ): T[] {
    const result: T[] = [];
    let count = 0;

    for (const item of set) {
      if (count < offset) {
        count++;
        continue;
      }

      if (limit >= 0 && result.length >= limit) break;

      result.push(item);
    }

    return result;
  }
}
