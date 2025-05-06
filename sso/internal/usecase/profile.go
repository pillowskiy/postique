package usecase

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/domain/event"
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
	ProfileByUsername(ctx context.Context, username string) (*domain.UserProfile, error)
}

type profileUseCase struct {
	profileRepo ProfileRepository
	profilePub  event.EventPublisher
	log         *slog.Logger
}

func NewProfileUseCase(profileRepo ProfileRepository, userPub event.EventPublisher, log *slog.Logger) *profileUseCase {
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

	if err := uc.profileRepo.SaveProfile(ctx, profile.UserID, profile); err != nil {
		log.Error("Failed to save profile", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	if err := uc.publishProfileChanges(profile); err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}
	log.Debug("Profile updated successfully")

	return &dto.Profile{
		UserID:     string(profile.UserID),
		Username:   string(profile.Username),
		AvatarPath: profile.AvatarPath.String(),
		Bio:        string(profile.Bio),
		CreatedAt:  profile.CreatedAt,
	}, nil
}

func (uc *profileUseCase) CreateProfile(ctx context.Context, input *dto.CreateProfileInput) (*dto.Profile, error) {
	const op = "usecase.profileUseCase.CreateProfile"
	log := uc.log.With(slog.String("op", op), slog.Any("profile", input))

	log.Debug("Creating profile")
	storedProfile, err := uc.Profile(ctx, input.UserID)
	if storedProfile != nil || err == nil {
		return nil, fmt.Errorf("%s: %w", op, ErrProfileAlreadyExists)
	}

	if err != nil && !errors.Is(err, ErrProfileNotFound) {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	profile, err := domain.NewUserProfile(input.UserID, input.Username, "", input.Bio)
	if err != nil {
		log.Warn("Failed to parse domain user profile", slog.String("error", err.Error()))
		return nil, parseDomainErr(err)
	}

	if err := uc.profileRepo.CreateProfile(ctx, profile); err != nil {
		log.Error("Failed to save profile", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}
	log.Debug("Profile created successfully")

	return &dto.Profile{
		UserID:     string(profile.UserID),
		Username:   string(profile.Username),
		AvatarPath: profile.AvatarPath.String(),
		Bio:        string(profile.Bio),
		CreatedAt:  profile.CreatedAt,
	}, nil
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

func (uc *profileUseCase) UserProfile(ctx context.Context, username string) (*dto.Profile, error) {
	const op = "usecase.profileUseCase.UserProfile"
	log := uc.log.With(slog.String("op", op), slog.Any("username", username))

	profile, err := uc.profileRepo.ProfileByUsername(ctx, username)
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

func (uc *profileUseCase) publishProfileChanges(profile *domain.UserProfile) error {
	const op = "usecase.profileUseCase.publishProfileChanges"
	log := uc.log.With(slog.String("op", op), slog.Any("profile", profile))

	if err := uc.profilePub.Publish(event.NewUserProfileEvent(profile)); err != nil {
		log.Error("Failed to publish profile event", slog.String("error", err.Error()))
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}
