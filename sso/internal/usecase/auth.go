package usecase

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/dto"
	"github.com/pillowskiy/postique/sso/internal/lib/jwt"
	"golang.org/x/exp/slog"
)

type AuthRepository interface {
	SaveUser(ctx context.Context, user *domain.User) (domain.ID, error)
	User(ctx context.Context, email domain.Email) (*domain.User, error)
	IsAdmin(ctx context.Context, userID domain.ID) (bool, error)
}

type AuthAppRepository interface {
	App(ctx context.Context, appID domain.ID) (*domain.App, error)
}

type authUseCase struct {
	authRepo      AuthRepository
	appRepo       AuthAppRepository
	appDecryptKey string
	tokenTTL      time.Duration
	log           *slog.Logger
}

func NewAuthUseCase(authRepo AuthRepository, appRepo AuthAppRepository, tokenTTL time.Duration, appDecryptKey string, log *slog.Logger) *authUseCase {
	return &authUseCase{
		authRepo:      authRepo,
		appRepo:       appRepo,
		tokenTTL:      tokenTTL,
		appDecryptKey: appDecryptKey,
	}
}

func (uc *authUseCase) Login(ctx context.Context, dto *dto.LoginUserDTO) (string, error) {
	const op = "usecase.authUseCase.Login"
	log := uc.log.With(slog.String("op", op), slog.String("email", dto.Email), slog.String("appID", dto.AppID))

	log.Debug("Attempting to login user")
	email, err := domain.NewEmail(dto.Email)
	if err != nil {
		log.Warn("Failed to create domain email", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	appID, err := domain.NewID(dto.AppID)
	if err != nil {
		log.Warn("Failed to parse application id", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	user, err := uc.authRepo.User(ctx, email)
	if user == nil || err != nil {
		log.Warn("Failed to get user", slog.String("error", err.Error()))
		return "", errors.New("user with that email doesn't exist")
	}

	if err := user.Password.Compare(dto.Password); err != nil {
		log.Info("Invalid credentials", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	app, err := uc.appRepo.App(ctx, appID)
	if err != nil {
		return "", fmt.Errorf("%s: %w", op, err)
	}

	token, err := jwt.NewToken(user, app, uc.appDecryptKey, uc.tokenTTL)
	if err != nil {
		log.Error("Failed to generate token", slog.String("error", err.Error()))
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
		return "", errors.New("user with that email already exist")
	}

	userID, err := uc.authRepo.SaveUser(ctx, user)
	if err != nil {
		log.Error("Failed to save user", slog.String("error", err.Error()), slog.Any("userID", user.ID))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	log.Debug("Successfully registered user", slog.Any("userID", user.ID))

	return userID, nil
}

func (uc *authUseCase) IsAdmin(ctx context.Context, dto *dto.IsAdminDTO) (bool, error) {
	const op = "Auth.IsAdmin"
	log := uc.log.With(
		slog.String("op", op),
		slog.Any("userID", dto.UserID),
	)

	log.Debug("Checking if user is admin")
	userID, err := domain.NewID(dto.UserID)
	if err != nil {
		log.Warn("Failed to parse user id", slog.String("error", err.Error()))
		return false, fmt.Errorf("%s: %w", op, err)
	}

	isAdmin, err := uc.authRepo.IsAdmin(ctx, userID)
	if err != nil {
		log.Error("Failed to check if user is admin", slog.String("error", err.Error()))
		return false, fmt.Errorf("%s: %w", op, err)
	}
	log.Debug("Success check if user is admin", slog.Bool("is_admin", isAdmin))

	return isAdmin, nil
}
