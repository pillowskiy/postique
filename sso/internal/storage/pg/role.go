package pg

import (
	"context"
	"fmt"

	"github.com/lib/pq"
	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/storage/pg/pgutils"
)

type RoleStorage struct {
	*Storage
}

func NewRoleStorage(pg *Storage) *RoleStorage {
	return &RoleStorage{Storage: pg}
}

func (s *RoleStorage) GetPermissionRoles(ctx context.Context, permissionID domain.ID) ([]*domain.PermissionRole, error) {
	const op = "ph.RoleStorage.GetPermissionRoles"

	q, args, err := psql.
		Select("rp.role_id as role_id", "rp.allowed as allowed", "r.hoist as hoist").From("role_permissions rp").
		Where("rp.permission_id = ?", permissionID).Join("roles r ON r.id = rp.role_id").ToSql()
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	rows, err := s.ext(ctx).QueryxContext(ctx, q, args...)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	roles := make([]*domain.PermissionRole, 0, 10)
	if err := pgutils.StructSliceScan(rows, &roles); err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return roles, nil
}

func (s *RoleStorage) GetUserRolesHierarchy(ctx context.Context, userID domain.ID) (*domain.RolesHierarchy, error) {
	const op = "pg.RoleStorage.GetRolesHierarchy"

	const q = `
    WITH lr AS (
        SELECT r.id AS role_id, r.hoist
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
    ), vr AS (
        SELECT r.id AS role_id
        FROM roles r JOIN lr ON r.hoist <= lr.hoist
    )
    SELECT 
        array_agg(DISTINCT lr.role_id) AS leading_roles,
        array_agg(DISTINCT vr.role_id) AS virtual_roles 
    FROM lr, vr;
    `

	var leadingRoles, virtualRoles []string
	rowx := s.ext(ctx).QueryRowxContext(ctx, q, userID)
	if err := rowx.Scan((*pq.StringArray)(&leadingRoles), (*pq.StringArray)(&virtualRoles)); err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	toDomainIDs := func(arr []string) []domain.ID {
		sl := make([]domain.ID, 0, len(arr))
		for _, v := range arr {
			sl = append(sl, domain.ID(v))
		}
		return sl
	}

	return &domain.RolesHierarchy{
		LeadingRoles: toDomainIDs(leadingRoles),
		VirtualRoles: toDomainIDs(virtualRoles),
	}, nil
}
