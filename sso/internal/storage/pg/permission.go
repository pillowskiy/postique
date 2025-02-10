package pg

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/storage"
)

type PermissionStorage struct {
	*Storage
}

func NewPermissionStorage(pg *Storage) *PermissionStorage {
	return &PermissionStorage{Storage: pg}
}

func (s *PermissionStorage) GetPermission(ctx context.Context, name domain.PermName) (*domain.Permission, error) {
	const op = "pg.PermissionStorage.GetPermission"
	q, args, err := psql.Select("id", "name").From("permissions").Where("name = ?", name).ToSql()
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	perm := new(domain.Permission)
	rowx := s.ext(ctx).QueryRowxContext(ctx, q, args...)
	if err := rowx.StructScan(perm); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, storage.ErrPermissionNotFound
		}
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return perm, nil
}

func (s *PermissionStorage) HasPermissionWithHierarchy(ctx context.Context, permission domain.PermName, hierarchy *domain.RolesHierarchy) (bool, error) {
	const op = "pg.PermissionStorage.HasPermissionWithHierarchy"

	const q = `
    WITH leading_roles AS (SELECT UNNEST($1::UUID[]) AS role_id),
         virtual_roles AS (SELECT UNNEST($2::UUID[]) AS role_id)
    SELECT EXISTS (
        SELECT 1 FROM role_permissions rp
        JOIN virtual_roles vr ON rp.role_id = vr.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE p.name = $3
        AND rp.allowed = TRUE
        AND (
            vr.role_id IN (SELECT role_id FROM leading_roles)
            OR NOT EXISTS (
                SELECT 1
                FROM role_permissions rp2
                JOIN virtual_roles vr2 ON rp2.role_id = vr2.role_id
                WHERE rp2.permission_id = rp.permission_id
                AND rp2.allowed = FALSE
            )
        )
    );
    `

	hasPermission := false
	rowx := s.ext(ctx).QueryRowxContext(ctx, q, hierarchy.LeadingRoles, hierarchy.VirtualRoles, permission)
	if err := rowx.Scan(&hasPermission); err != nil {
		return false, fmt.Errorf("%s: %w", op, err)
	}
	return hasPermission, nil
}
