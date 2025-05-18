import { CursorEntity } from '@/domain/cursor/cursor.entity';
import { randomUUID } from 'crypto';

describe('CursorEntity', () => {
  interface TestItem {
    id: string;
    name: string;
    createdAt: Date;
  }

  describe('creation', () => {
    it('should create cursor entity with specified cursor field', () => {
      // Act
      const cursor = new CursorEntity<TestItem>('createdAt');

      // Assert
      expect(cursor).toBeDefined();
      expect(cursor.cursorField).toBe('createdAt');
      expect(cursor.cursor).toBeNull();
      expect(cursor.items).toEqual([]);
      expect(cursor.size).toBe(0);
    });
  });

  describe('appending items', () => {
    it('should append item and update cursor value', () => {
      // Arrange
      const cursor = new CursorEntity<TestItem>('createdAt');
      const now = new Date();
      const item: TestItem = {
        id: randomUUID(),
        name: 'Test Item',
        createdAt: now,
      };

      // Act
      cursor.append(item);

      // Assert
      expect(cursor.cursor).toBe(now);
      expect(cursor.items).toEqual([item]);
      expect(cursor.size).toBe(1);
    });

    it('should append multiple items and update cursor to latest value', () => {
      // Arrange
      const cursor = new CursorEntity<TestItem>('createdAt');
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-01-02');
      const date3 = new Date('2023-01-03');

      const item1: TestItem = {
        id: randomUUID(),
        name: 'Item 1',
        createdAt: date1,
      };

      const item2: TestItem = {
        id: randomUUID(),
        name: 'Item 2',
        createdAt: date2,
      };

      const item3: TestItem = {
        id: randomUUID(),
        name: 'Item 3',
        createdAt: date3,
      };

      // Act
      cursor.append(item1);
      cursor.append(item2);
      cursor.append(item3);

      // Assert
      expect(cursor.cursor).toBe(date3);
      expect(cursor.items).toEqual([item1, item2, item3]);
      expect(cursor.size).toBe(3);
    });

    it('should handle string cursor field', () => {
      // Arrange
      const cursor = new CursorEntity<TestItem>('id');
      const id = randomUUID();
      const item: TestItem = {
        id,
        name: 'Test Item',
        createdAt: new Date(),
      };

      // Act
      cursor.append(item);

      // Assert
      expect(cursor.cursor).toBe(id);
    });

    it('should set cursor to null when field is missing', () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const cursor = new CursorEntity<TestItem>('missingField' as any);
      const item: TestItem = {
        id: randomUUID(),
        name: 'Test Item',
        createdAt: new Date(),
      };

      // Act
      cursor.append(item);

      // Assert
      expect(cursor.cursor).toBeNull();
    });
  });
});
