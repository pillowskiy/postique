import { UserEntity } from '@/domain/user/entity/user.entity';
import { randomUUID } from 'crypto';

describe('UserEntity', () => {
  const mockUserData = {
    id: randomUUID(),
    email: 'test@example.com',
    username: 'testuser',
    avatarPath: '/avatars/default.png',
  };

  describe('creation', () => {
    it('should create a valid user entity', () => {
      // Act
      const user = UserEntity.create(mockUserData);

      // Assert
      expect(user).toBeDefined();
      expect(user.id).toBe(mockUserData.id);
      expect(user.email).toBe(mockUserData.email);
      expect(user.username).toBe(mockUserData.username);
      expect(user.avatarPath).toBe(mockUserData.avatarPath);
    });

    it('should generate a new UUID if not provided', () => {
      // Arrange
      const userDataWithoutId = {
        email: 'test@example.com',
        username: 'testuser',
        avatarPath: '/avatars/default.png',
      };

      // Act
      const user = UserEntity.create(userDataWithoutId);

      // Assert
      expect(user.id).toBeDefined();
      expect(user.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      ); // UUID v4 format
    });
  });
});
