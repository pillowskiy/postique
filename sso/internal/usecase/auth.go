package usecase

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/dto"
	"github.com/pillowskiy/postique/sso/internal/storage"
)

var (
	ErrUserAlreadyExists  = errors.New("user already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type AuthRepository interface {
	SaveUser(ctx context.Context, user *domain.User) (domain.ID, error)
	User(ctx context.Context, email domain.Email) (*domain.User, error)
}

type AuthAppUseCase interface {
	GenerateToken(ctx context.Context, user *domain.User, appName domain.Name) (string, error)
	App(ctx context.Context, appName string) (*domain.App, error)
}

type authUseCase struct {
	authRepo AuthRepository
	appUC    AuthAppUseCase
	log      *slog.Logger
}

func NewAuthUseCase(authRepo AuthRepository, appUC AuthAppUseCase, log *slog.Logger) *authUseCase {
	return &authUseCase{
		authRepo: authRepo,
		appUC:    appUC,
		log:      log,
	}
}

func (uc *authUseCase) Login(ctx context.Context, dto *dto.LoginUserDTO) (string, error) {
	const op = "usecase.authUseCase.Login"
	log := uc.log.With(slog.String("op", op), slog.String("email", dto.Email), slog.String("appName", dto.AppName))

	log.Debug("Attempting to login user")
	email, err := domain.NewEmail(dto.Email)
	if err != nil {
		log.Warn("Failed to create domain email", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	appName, err := domain.NewName(dto.AppName)
	if err != nil {
		log.Warn("Failed to parse application id", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	user, err := uc.authRepo.User(ctx, email)
	if err != nil {
		if errors.Is(err, storage.ErrUserNotFound) {
			return "", fmt.Errorf("%s: %w", op, ErrInvalidCredentials)
		}

		log.Error("Failed to get user", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	if err := user.Password.Compare(dto.Password); err != nil {
		log.Info("Invalid credentials", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, ErrInvalidCredentials)
	}

	token, err := uc.appUC.GenerateToken(ctx, user, appName)
	if err != nil {
		return "", fmt.Errorf("%s: %w", op, err)
	}

	log.Debug("User logged in successfully")

	return token, nil
}

func (uc *authUseCase) Register(ctx context.Context, dto *dto.RegisterUserDTO) (domain.ID, error) {
	const op = "usecase.authUseCase.Register"
	log := uc.log.With(slog.String("op", op), slog.String("email", dto.Email))

	log.Debug("Registering user")
	user, err := domain.NewUser(dto.Email, dto.Password)
	if err != nil {
		log.Warn("Failed to create domain user", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	storedUser, err := uc.authRepo.User(ctx, user.Email)
	if storedUser != nil || err == nil {
		log.Debug("User already exists", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, ErrUserAlreadyExists)
	}

	userID, err := uc.authRepo.SaveUser(ctx, user)
	if err != nil {
		log.Error("Failed to save user", slog.String("error", err.Error()), slog.Any("userID", user.ID))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	log.Debug("Successfully registered user", slog.Any("userID", user.ID))

	return userID, nil
}
