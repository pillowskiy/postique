import { CursorEntity } from '@/domain/cursor';
import { CursorOutput } from '../dto/output';

export class CursorMapper {
  static toDto<T extends Record<string, any>, K>(
    cursor: CursorEntity<T>,
    mapObj: { toDto(item: T): K },
  ): CursorOutput<K> {
    return new CursorOutput(
      cursor.items.map((e) => mapObj.toDto(e)),
      cursor.cursorField as string,
      cursor.size,
    );
  }

  static toDetailedDto<T extends Record<string, any>, K>(
    cursor: CursorEntity<T>,
    mapObj: { toDetailedDto(item: T): K },
  ): CursorOutput<K> {
    return new CursorOutput(
      cursor.items.map((e) => mapObj.toDetailedDto(e)),
      cursor.cursorField as string,
      cursor.size,
    );
  }
}
