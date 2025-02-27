package usecase

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/pillowskiy/postique/files/internal/domain"
	"github.com/pillowskiy/postique/files/internal/dto"
	"github.com/pillowskiy/postique/files/internal/lib/jwt"
)

var (
	ErrAppAlreadyExists = errors.New("app already exists")
	ErrAppNotFound      = errors.New("app bucket not found")
)

type AppFileUseCase interface {
	BucketExists(ctx context.Context, bucket string) (bool, error)
	SaveBucket(ctx context.Context, bucket domain.Bucket) error
}

type appUseCase struct {
	secret string
	fileUC AppFileUseCase
	log    *slog.Logger
}

func NewAppUseCase(fileUC AppFileUseCase, secret string, log *slog.Logger) *appUseCase {
	return &appUseCase{fileUC: fileUC, secret: secret, log: log}
}

func (uc *appUseCase) CreateApp(ctx context.Context, name string, bucket string) (string, error) {
	const op = "usecase.app.CreateApp"
	log := uc.log.With(slog.String("op", op), slog.String("name", name), slog.String("bucket", bucket))

	exists, err := uc.fileUC.BucketExists(ctx, bucket)
	if !exists || err != nil {
		log.Warn("bucket exists check", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, ErrAppAlreadyExists)
	}

	app, err := domain.NewApp(name, bucket)
	if err != nil {
		log.Error("failed to create an app", slog.String("error", err.Error()))
		return "", fmt.Errorf("%w: %w", ErrInvalidInput, err)
	}

	appPayload := &dto.AppPayload{
		Name:   app.Name.String(),
		Bucket: app.Bucket.String(),
		IAT:    app.GeneratedAt.Unix(),
	}

	token, err := jwt.New(appPayload, uc.secret)
	if err != nil {
		log.Error("failed to generate token", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	if err := uc.fileUC.SaveBucket(ctx, app.Bucket); err != nil {
		log.Error("failed to save bucket", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	return token, nil
}

func (uc *appUseCase) DecryptApp(ctx context.Context, token string) (*dto.AppPayload, error) {
	const op = "usecase.app.DecryptApp"

	payload := &dto.AppPayload{}
	if err := jwt.VerifyAndScan(token, uc.secret, payload); err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	// NOTE: It is necessary to check invariants
	_, err := domain.ParseApp(payload.Name, payload.Bucket, payload.IAT)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return payload, nil
}
