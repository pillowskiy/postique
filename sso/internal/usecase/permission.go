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

var ErrPermissionNotFound = errors.New("permission not found")

type PermissionRepository interface {
	Save(ctx context.Context, perm *domain.Permission) error
	GetPermission(ctx context.Context, name domain.PermName) (*domain.Permission, error)
	storage.Transactional
}

type PermissionRoleUseCase interface {
	HasPermittedRole(ctx context.Context, userID string, permID string) (bool, error)
}

type permissionUseCase struct {
	permRepo PermissionRepository
	roleUC   PermissionRoleUseCase
	log      *slog.Logger
}

func NewPermissionUseCase(permRepo PermissionRepository, roleUC PermissionRoleUseCase, log *slog.Logger) *permissionUseCase {
	return &permissionUseCase{permRepo: permRepo, roleUC: roleUC, log: log}
}

func (uc *permissionUseCase) SyncPermissions(ctx context.Context, perms []string) error {
	const op = "usecase.permissionUseCase.SyncPermissions"
	log := uc.log.With(slog.String("op", op), slog.Any("perms", perms))

	log.Debug("Syncing permissions")
	err := uc.permRepo.DoInTransaction(ctx, func(ctx context.Context) error {
		for _, perm := range perms {
			domainPerm, err := domain.NewPermission(perm)
			if err != nil {
				log.Warn("Failed to create domain permission", slog.String("error", err.Error()))
				return parseDomainErr(err)
			}

			if err := uc.permRepo.Save(ctx, domainPerm); err != nil {
				log.Error("Failed to save permission", slog.String("error", err.Error()))
				return fmt.Errorf("%s: %w", op, err)
			}
		}
		return nil
	})
	if err != nil {
		return err
	}
	log.Debug("Permissions synced successfully")

	return nil
}

func (uc *permissionUseCase) HasPermission(ctx context.Context, userID string, permName string) (bool, error) {
	const op = "usecase.permissionUseCase.HasPermission"

	perm, err := uc.GetPermission(ctx, permName)
	if err != nil {
		if errors.Is(err, ErrPermissionNotFound) {
			return false, nil
		}
		return false, fmt.Errorf("%s: %w", op, err)
	}

	hasPermission, err := uc.roleUC.HasPermittedRole(ctx, userID, perm.ID)
	if err != nil {
		return false, fmt.Errorf("%s: %w", op, err)
	}

	return hasPermission, nil
}

func (uc *permissionUseCase) GetPermission(ctx context.Context, name string) (*dto.Permission, error) {
	perm, err := uc.getPermission(ctx, name)
	if err != nil {
		return nil, err
	}

	return &dto.Permission{
		ID:   string(perm.ID),
		Name: string(perm.Name),
	}, nil
}

func (uc *permissionUseCase) getPermission(ctx context.Context, name string) (*domain.Permission, error) {
	const op = "usecase.permissionUseCase.getPermission"
	log := uc.log.With(slog.String("op", op), slog.String("permName", name))

	permName, err := domain.NewPermName(name)
	if err != nil {
		log.Warn("Failed to parse domain permission name", slog.String("error", err.Error()))
		return nil, parseDomainErr(err)
	}

	perm, err := uc.permRepo.GetPermission(ctx, permName)
	if err != nil {
		if errors.Is(err, storage.ErrPermissionNotFound) {
			return nil, fmt.Errorf("%s: %w", op, ErrPermissionNotFound)
		}
		log.Error("Failed to get permission", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}
	return perm, nil
}
