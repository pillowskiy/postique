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
	CreateSession(ctx context.Context, payload *dto.UserPayload, appName string) (*dto.Session, error)
	App(ctx context.Context, appName string) (*dto.AppResult, error)
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

func (uc *authUseCase) Login(ctx context.Context, input *dto.LoginUserInput) (*dto.Session, error) {
	const op = "usecase.authUseCase.Login"
	log := uc.log.With(slog.String("op", op), slog.String("email", input.Email), slog.String("appName", input.AppName))

	log.Debug("Attempting to login user")
	email, err := domain.NewEmail(input.Email)
	if err != nil {
		log.Warn("Failed to create domain email", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	user, err := uc.authRepo.User(ctx, email)
	if err != nil {
		if errors.Is(err, storage.ErrUserNotFound) {
			return nil, fmt.Errorf("%s: %w", op, ErrInvalidCredentials)
		}

		log.Error("Failed to get user", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	if err := user.Password.Compare(input.Password); err != nil {
		log.Info("Invalid credentials", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, ErrInvalidCredentials)
	}

	payload := &dto.UserPayload{UserID: string(user.ID)}
	session, err := uc.appUC.CreateSession(ctx, payload, input.AppName)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	log.Debug("User logged in successfully")

	return session, nil
}

func (uc *authUseCase) Register(ctx context.Context, input *dto.RegisterUserInput) (*dto.RegisterUserResult, error) {
	const op = "usecase.authUseCase.Register"
	log := uc.log.With(slog.String("op", op), slog.String("email", input.Email))

	log.Debug("Registering user")
	user, err := domain.NewUser(input.Email, input.Password)
	if err != nil {
		log.Warn("Failed to create domain user", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	storedUser, err := uc.authRepo.User(ctx, user.Email)
	if storedUser != nil || err == nil {
		return nil, fmt.Errorf("%s: %w", op, ErrUserAlreadyExists)
	}

	userID, err := uc.authRepo.SaveUser(ctx, user)
	if err != nil {
		log.Error("Failed to save user", slog.String("error", err.Error()), slog.Any("userID", user.ID))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	log.Debug("Successfully registered user", slog.Any("userID", user.ID))

	return &dto.RegisterUserResult{UserID: string(userID)}, nil
}
