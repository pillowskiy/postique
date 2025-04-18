package usecase

import (
	"context"
	"fmt"
	"log/slog"

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
	log         *slog.Logger
}

func NewFileService(fileStorage FileStorage, log *slog.Logger) *fileUseCase {
	return &fileUseCase{fileStorage: fileStorage, log: log}
}

func (uc *fileUseCase) SaveBucket(ctx context.Context, bucket domain.Bucket) error {
	const op = "usecase.fileUseCase.SaveBucket"
	log := uc.log.With(slog.String("op", op))

	if err := uc.fileStorage.SaveBucket(ctx, bucket); err != nil {
		log.Error("failed to save bucket", slog.String("error", err.Error()))
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}

func (uc *fileUseCase) BucketExists(ctx context.Context, bucket string) (bool, error) {
	const op = "usecase.fileUseCase.BucketExists"
	log := uc.log.With(slog.String("op", op))

	dBucket, err := domain.NewBucket(bucket)
	if err != nil {
		log.Error("failed to create bucket", slog.String("error", err.Error()))
		return false, fmt.Errorf("%w: %w", ErrInvalidInput, err)
	}

	exists, err := uc.fileStorage.BucketExists(ctx, dBucket)
	if err != nil {
		log.Error("failed to check if bucket exists", slog.String("error", err.Error()))
		return false, fmt.Errorf("%s: %w", op, err)
	}

	return exists, nil
}

func (uc *fileUseCase) Upload(ctx context.Context, file *dto.File, bucket string) error {
	const op = "usecase.fileUseCase.Upload"
	log := uc.log.With(slog.String("op", op))

	dFile, err := domain.NewFile(file.Data, file.Name, file.ContentType)
	if err != nil {
		log.Warn("failed to parse domain file", slog.String("error", err.Error()))
		return fmt.Errorf("%w: %w", ErrInvalidInput, err)
	}

	dBucket, err := domain.NewBucket(bucket)
	if err != nil {
		log.Warn("failed to parse domain bucket", slog.String("error", err.Error()))
		return fmt.Errorf("%w: %w", ErrInvalidInput, err)
	}

	if err := uc.fileStorage.Put(ctx, dFile, dBucket); err != nil {
		log.Error("failed to upload file", slog.String("error", err.Error()))
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}

func (uc *fileUseCase) Delete(ctx context.Context, name string, bucket string) error {
	const op = "usecase.fileUseCase.Delete"
	log := uc.log.With(slog.String("op", op), slog.String("name", name), slog.String("bucket", bucket))

	fileName, err := domain.NewFileName(name)
	if err != nil {
		log.Warn("failed to parse domain file name", slog.String("error", err.Error()))
		return fmt.Errorf("%w: %w", ErrInvalidInput, err)
	}

	fileBucket, err := domain.NewBucket(bucket)
	if err != nil {
		log.Warn("failed to parse domain bucket", slog.String("error", err.Error()))
		return fmt.Errorf("%w: %w", ErrInvalidInput, err)
	}

	if err := uc.fileStorage.Delete(ctx, fileName, fileBucket); err != nil {
		log.Error("failed to delete file", slog.String("error", err.Error()))
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}
