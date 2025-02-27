package usecase

import (
	"context"
	"fmt"

	"github.com/pillowskiy/postique/files/internal/domain"
	"github.com/pillowskiy/postique/files/internal/dto"
)

type FileStorage interface {
	Put(ctx context.Context, file *domain.File, bucket domain.Bucket) error
	Delete(ctx context.Context, name domain.FileName, bucket domain.Bucket) error
	BucketExists(ctx context.Context, bucket domain.Bucket) (bool, error)
	SaveBucket(ctx context.Context, bucket domain.Bucket) error
}

type fileUseCase struct {
	fileStorage FileStorage
}

func NewFileService(fileStorage FileStorage) *fileUseCase {
	return &fileUseCase{fileStorage: fileStorage}
}

func (uc *fileUseCase) SaveBucket(ctx context.Context, bucket domain.Bucket) error {
	const op = "usecase.fileUseCase.SaveBucket"

	if err := uc.fileStorage.SaveBucket(ctx, bucket); err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}

func (uc *fileUseCase) BucketExists(ctx context.Context, bucket string) (bool, error) {
	const op = "usecase.fileUseCase.BucketExists"

	dBucket, err := domain.NewBucket(bucket)
	if err != nil {
		return false, fmt.Errorf("%w: %w", ErrInvalidInput, err)
	}

	exists, err := uc.fileStorage.BucketExists(ctx, dBucket)
	if err != nil {
		return false, fmt.Errorf("%s: %w", op, err)
	}

	return exists, nil
}

func (uc *fileUseCase) Upload(ctx context.Context, file *dto.File, bucket string) error {
	const op = "usecase.fileUseCase.Upload"

	dFile, err := domain.NewFile(file.Data, file.Name, file.ContentType)
	if err != nil {
		return fmt.Errorf("%w: %w", ErrInvalidInput, err)
	}

	dBucket, err := domain.NewBucket(bucket)
	if err != nil {
		return fmt.Errorf("%w: %w", ErrInvalidInput, err)
	}

	if err := uc.fileStorage.Put(ctx, dFile, dBucket); err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}

func (uc *fileUseCase) Delete(ctx context.Context, name string, bucket string) error {
	const op = "usecase.fileUseCase.Delete"

	fileName, err := domain.NewFileName(name)
	if err != nil {
		return fmt.Errorf("%w: %w", ErrInvalidInput, err)
	}

	fileBucket, err := domain.NewBucket(bucket)
	if err != nil {
		return fmt.Errorf("%w: %w", ErrInvalidInput, err)
	}

	if err := uc.fileStorage.Delete(ctx, fileName, fileBucket); err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}
