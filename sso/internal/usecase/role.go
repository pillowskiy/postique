package usecase

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/pillowskiy/postique/sso/internal/domain"
)

type RoleRepository interface {
	GetUserRolesHierarchy(ctx context.Context, userID domain.ID) (*domain.RolesHierarchy, error)
	GetPermissionRoles(ctx context.Context, permissionID domain.ID) ([]*domain.PermissionRole, error)
}

type roleUseCase struct {
	roleRepo RoleRepository
	log      *slog.Logger
}

func NewRoleUseCase(roleRepo RoleRepository, log *slog.Logger) *roleUseCase {
	return &roleUseCase{roleRepo: roleRepo, log: log}
}

func (uc *roleUseCase) HasPermittedRole(ctx context.Context, userID domain.PID, permID domain.PID) (bool, error) {
	const op = "usecase.roleUseCase.HasUserPermittedRole"
	log := uc.log.With(
		slog.String("op", op),
		slog.Any("userID", userID),
		slog.String("permID", permID),
	)

	uid, err := domain.NewID(userID)
	if err != nil {
		log.Warn("Failed to parse domain user id", slog.String("error", err.Error()))
		return false, parseDomainErr(err)
	}

	hier, err := uc.roleRepo.GetUserRolesHierarchy(ctx, uid)
	if err != nil {
		log.Error("Failed to get user roles hierarchy", slog.String("error", err.Error()))
		return false, fmt.Errorf("%s: %w", op, err)
	}

	pid, err := domain.NewID(permID)
	if err != nil {
		log.Warn("Failed to parse domain permission id", slog.String("error", err.Error()))
		return false, parseDomainErr(err)
	}

	permRoles, err := uc.roleRepo.GetPermissionRoles(ctx, pid)
	if err != nil {
		log.Error("Failed to get permission roles", slog.String("error", err.Error()))
		return false, fmt.Errorf("%s: %w", op, err)
	}

	hasPermission := hier.HasPermittedRole(permRoles)
	log.Debug(
		"Has permitted role completed successfully",
		slog.Any("hierarchy", hier), slog.Bool("hasPermission", hasPermission),
	)

	return hasPermission, nil
}
