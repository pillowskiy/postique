package s3

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	manager "github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/pillowskiy/postique/files/internal/domain"
)

type fileStorage struct {
	s3 *Storage
}

func NewFileStorage(s3 *Storage) *fileStorage {
	return &fileStorage{s3: s3}
}

func (s *fileStorage) SaveBucket(ctx context.Context, bucket domain.Bucket) error {
	const op = "storage.s3.SaveBucket"

	_, err := s.s3.CreateBucketWithContext(ctx, &s3.CreateBucketInput{
		Bucket: aws.String(bucket.String()),
	})
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}

func (s *fileStorage) BucketExists(ctx context.Context, bucket domain.Bucket) (bool, error) {
	_, err := s.s3.HeadBucketWithContext(ctx, &s3.HeadBucketInput{
		Bucket: aws.String(bucket.String()),
	})
	if err != nil {
		return false, nil
	}

	return true, nil
}

func (s *fileStorage) Put(ctx context.Context, file *domain.File, bucket domain.Bucket) error {
	const op = "storage.s3.Put"
	_, err := s.s3.Uploader.UploadWithContext(ctx, &manager.UploadInput{
		Bucket:      aws.String(bucket.String()),
		Key:         aws.String(file.Name.String()),
		Body:        file.Data,
		ContentType: aws.String(file.ContentType.String()),
	})
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}

func (s *fileStorage) Delete(ctx context.Context, name domain.FileName, bucket domain.Bucket) error {
	const op = "storage.s3.Delete"

	_, err := s.s3.DeleteObjectWithContext(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(bucket.String()),
		Key:    aws.String(name.String()),
	})
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}
