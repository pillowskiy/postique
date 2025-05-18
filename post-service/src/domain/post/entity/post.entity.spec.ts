import { DomainBusinessRuleViolation } from '@/domain/common/error';
import { PostEntity } from '@/domain/post/entity/post.entity';
import {
  PostStatus,
  PostVisibility,
} from '@/domain/post/entity/post.interface';
import { randomUUID } from 'crypto';

describe('PostEntity', () => {
  const mockPostData = {
    id: randomUUID(),
    title: 'Test Post',
    description: 'Test Description',
    owner: randomUUID(),
    authors: [randomUUID()],
    slug: 'test-post',
    status: PostStatus.Draft,
    visibility: PostVisibility.Public,
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    content: randomUUID(),
    coverImage: 'https://example.com/cover.jpg',
  };

  describe('creation', () => {
    it('should create a valid post entity', () => {
      // Act
      const post = PostEntity.create(mockPostData);

      // Assert
      expect(post).toBeDefined();
      expect(post.id).toBe(mockPostData.id);
      expect(post.title).toBe(mockPostData.title);
      expect(post.description).toBe(mockPostData.description);
      expect(post.owner).toBe(mockPostData.owner);
      expect(post.authors).toEqual(mockPostData.authors);
      expect(post.slug).toBe(mockPostData.slug);
      expect(post.status).toBe(PostStatus.Draft);
      expect(post.visibility).toBe(PostVisibility.Public);
    });
  });

  describe('changeVisibility', () => {
    it('should change post visibility', () => {
      // Arrange
      const post = PostEntity.create(mockPostData);

      // Act
      post.changeVisibility(PostVisibility.Private);

      // Assert
      expect(post.visibility).toBe(PostVisibility.Private);
    });

    it('should throw error when visibility is unchanged', () => {
      // Arrange
      const post = PostEntity.create(mockPostData);

      // Act & Assert
      expect(() => post.changeVisibility(PostVisibility.Public)).toThrow(
        DomainBusinessRuleViolation,
      );
    });

    it('should throw error when post is archived', () => {
      // Arrange
      const post = PostEntity.create({
        ...mockPostData,
        status: PostStatus.Archived,
      });

      // Act & Assert
      expect(() => post.changeVisibility(PostVisibility.Private)).toThrow(
        DomainBusinessRuleViolation,
      );
    });
  });

  describe('updateMetadata', () => {
    it('should update post metadata', () => {
      // Arrange
      const post = PostEntity.create(mockPostData);
      const newMetadata = {
        title: 'Updated Title',
        description: 'Updated Description',
        coverImage: 'https://example.com/new-cover.jpg',
      };

      // Act
      post.updateMetadata(newMetadata);

      // Assert
      expect(post.title).toBe(newMetadata.title);
      expect(post.description).toBe(newMetadata.description);
      expect(post.coverImage).toBe(newMetadata.coverImage);
      expect(post.status).toBe(PostStatus.Draft);
    });

    it('should throw error when post is archived', () => {
      // Arrange
      const post = PostEntity.create({
        ...mockPostData,
        status: PostStatus.Archived,
      });

      // Act & Assert
      expect(() => post.updateMetadata({ title: 'New Title' })).toThrow(
        DomainBusinessRuleViolation,
      );
    });
  });

  describe('publish', () => {
    it('should publish a draft post', () => {
      // Arrange
      const post = PostEntity.create({
        ...mockPostData,
        status: PostStatus.Draft,
      });

      // Act
      post.publish();

      // Assert
      expect(post.status).toBe(PostStatus.Published);
      expect(post.publishedAt).toBeInstanceOf(Date);
    });

    it('should throw error when post is not in draft state', () => {
      // Arrange
      const post = PostEntity.create({
        ...mockPostData,
        status: PostStatus.Published,
      });

      // Act & Assert
      expect(() => post.publish()).toThrow(DomainBusinessRuleViolation);
    });
  });

  describe('archive', () => {
    it('should archive a post', () => {
      // Arrange
      const post = PostEntity.create(mockPostData);

      // Act
      post.archive();

      // Assert
      expect(post.status).toBe(PostStatus.Archived);
      expect(post.publishedAt).toBeNull();
    });

    it('should throw error when post is already archived', () => {
      // Arrange
      const post = PostEntity.create({
        ...mockPostData,
        status: PostStatus.Archived,
      });

      // Act & Assert
      expect(() => post.archive()).toThrow(DomainBusinessRuleViolation);
    });
  });

  describe('draft', () => {
    it('should set post status to draft', () => {
      // Arrange
      const post = PostEntity.create({
        ...mockPostData,
        status: PostStatus.Published,
      });

      // Act
      post.draft();

      // Assert
      expect(post.status).toBe(PostStatus.Draft);
    });

    it('should throw error when post is archived', () => {
      // Arrange
      const post = PostEntity.create({
        ...mockPostData,
        status: PostStatus.Archived,
      });

      // Act & Assert
      expect(() => post.draft()).toThrow(DomainBusinessRuleViolation);
    });
  });

  describe('isFresh', () => {
    it('should return true for new draft posts', () => {
      // Arrange
      const post = PostEntity.create({
        ...mockPostData,
        status: PostStatus.Draft,
        createdAt: new Date(),
      });

      // Act & Assert
      expect(post.isFresh()).toBe(true);
    });

    it('should return true for recently created posts', () => {
      // Arrange
      const post = PostEntity.create({
        ...mockPostData,
        status: PostStatus.Published,
        createdAt: new Date(),
      });

      // Act & Assert
      expect(post.isFresh()).toBe(true);
    });

    it('should return false for old published posts', () => {
      // Arrange
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10); // 10 days ago

      const post = PostEntity.create({
        ...mockPostData,
        status: PostStatus.Published,
        createdAt: oldDate,
      });

      // Act & Assert
      expect(post.isFresh()).toBe(false);
    });
  });
});
