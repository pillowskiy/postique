import { PostAggregate } from '@/domain/post/entity/post.aggregate';
import {
  PostStatus,
  PostVisibility,
} from '@/domain/post/entity/post.interface';
import { UserEntity } from '@/domain/user';
import { randomUUID } from 'crypto';

describe('PostAggregate', () => {
  const mockUserId = randomUUID();
  const mockAuthorId = randomUUID();

  const mockPostData = {
    id: randomUUID(),
    title: 'Test Post',
    description: 'Test Description',
    owner: mockUserId,
    authors: [mockAuthorId],
    slug: 'test-post',
    status: PostStatus.Draft,
    visibility: PostVisibility.Public,
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    content: randomUUID(),
    coverImage: 'https://example.com/cover.jpg',
  };

  const mockUserData = {
    id: mockUserId,
    email: 'test@example.com',
    username: 'testuser',
    avatarPath: '/avatars/default.png',
  };

  describe('creation', () => {
    it('should create a valid post aggregate', () => {
      // Act
      const postAggregate = PostAggregate.create(mockPostData);

      // Assert
      expect(postAggregate).toBeDefined();
      expect(postAggregate.id).toBe(mockPostData.id);
      expect(postAggregate.title).toBe(mockPostData.title);
      expect(postAggregate.owner).toBe(mockPostData.owner);
    });
  });

  describe('owner reference', () => {
    it('should throw error when accessing ownerRef before it is set', () => {
      // Arrange
      const postAggregate = PostAggregate.create(mockPostData);

      // Act & Assert
      expect(() => postAggregate.ownerRef).toThrow('Post owner is not set');
    });

    it('should set and retrieve owner reference', () => {
      // Arrange
      const postAggregate = PostAggregate.create(mockPostData);
      const userEntity = UserEntity.create(mockUserData);

      // Act
      postAggregate.setOwner(userEntity);

      // Assert
      expect(postAggregate.ownerRef).toBe(userEntity);
      expect(postAggregate.owner).toBe(userEntity.id);
    });
  });

  describe('inheritance', () => {
    it('should inherit methods from PostEntity', () => {
      // Arrange
      const postAggregate = PostAggregate.create(mockPostData);

      // Act
      postAggregate.publish();

      // Assert
      expect(postAggregate.status).toBe(PostStatus.Published);
      expect(postAggregate.publishedAt).toBeInstanceOf(Date);
    });
  });
});
