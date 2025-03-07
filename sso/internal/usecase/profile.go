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
	ErrProfileNotFound      = errors.New("profile not found")
	ErrProfileAlreadyExists = errors.New("profile already exists")
)

type ProfileRepository interface {
    CreateProfile(ctx context.Context, profile *domain.UserProfile) error
	SaveProfile(ctx context.Context, userID domain.ID, profile *domain.UserProfile) error
	Profile(ctx context.Context, userID domain.ID) (*domain.UserProfile, error)
}

type profileUseCase struct {
	profileRepo ProfileRepository
	log         *slog.Logger
}

func NewProfileUseCase(profileRepo ProfileRepository, log *slog.Logger) *profileUseCase {
	return &profileUseCase{profileRepo: profileRepo, log: log}
}

func (uc *profileUseCase) UpdateProfile(ctx context.Context, userID domain.PID, input *dto.UpdateProfileInput) (*dto.Profile, error) {
	const op = "usecase.profileUseCase.UpdateProfile"
	log := uc.log.With(slog.String("op", op), slog.Any("profile", input))

	log.Debug("Updating profile")
	storedProfile, err := uc.Profile(ctx, userID)
	if err != nil && !errors.Is(err, ErrProfileNotFound) {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	if storedProfile == nil || err != nil {
		return nil, fmt.Errorf("%s: %w", op, ErrProfileNotFound)
	}

	profile, err := domain.NewUserProfile(userID, input.Username, input.AvatarPath, input.Bio)
	if err != nil {
		log.Warn("Failed to parse domain user profile", slog.String("error", err.Error()))
		return nil, parseDomainErr(err)
	}
	log.Debug("Profile updated successfully")

	if err := uc.profileRepo.SaveProfile(ctx, profile.UserID, profile); err != nil {
		log.Error("Failed to save profile", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return &dto.Profile{
		UserID:     string(profile.UserID),
		Username:   string(profile.Username),
		AvatarPath: profile.AvatarPath.String(),
		Bio:        string(profile.Bio),
		CreatedAt:  profile.CreatedAt,
	}, nil
}

func (uc *profileUseCase) CreateProfile(ctx context.Context, input *dto.CreateProfileInput) (domain.PID, error) {
	const op = "usecase.profileUseCase.CreateProfile"
	log := uc.log.With(slog.String("op", op), slog.Any("profile", input))

	log.Debug("Creating profile")
	storedProfile, err := uc.Profile(ctx, input.UserID)
	if storedProfile != nil || err == nil {
		return "", fmt.Errorf("%s: %w", op, ErrProfileAlreadyExists)
	}

	if err != nil && !errors.Is(err, ErrProfileNotFound) {
		return "", fmt.Errorf("%s: %w", op, err)
	}

	profile, err := domain.NewUserProfile(input.UserID, input.Username, "", input.Bio)
	if err != nil {
		log.Warn("Failed to parse domain user profile", slog.String("error", err.Error()))
		return "", parseDomainErr(err)
	}
	log.Debug("Profile created successfully")

	if err := uc.profileRepo.CreateProfile(ctx, profile); err != nil {
		log.Error("Failed to save profile", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	return domain.PID(profile.UserID), nil
}

func (uc *profileUseCase) Profile(ctx context.Context, userID domain.PID) (*dto.Profile, error) {
	const op = "usecase.profileUseCase.Profile"
	log := uc.log.With(slog.String("op", op), slog.Any("userID", userID))

	uid, err := domain.NewID(userID)
	if err != nil {
		return nil, parseDomainErr(err)
	}

	profile, err := uc.profileRepo.Profile(ctx, uid)
	if err != nil {
		if errors.Is(err, storage.ErrProfileNotFound) {
			return nil, fmt.Errorf("%s: %w", op, ErrProfileNotFound)
		}
		log.Error("Failed to get user profile", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return &dto.Profile{
		UserID:     string(profile.UserID),
		Username:   string(profile.Username),
		AvatarPath: profile.AvatarPath.String(),
		Bio:        string(profile.Bio),
		CreatedAt:  profile.CreatedAt,
	}, nil
}
