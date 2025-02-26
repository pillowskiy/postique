package domain

import "errors"

type RolesHierarchy struct {
	LeadingRoles []ID `db:"leading_roles"`
	VirtualRoles []ID `db:"virtual_roles"`
}

func (rh *RolesHierarchy) HasPermittedRole(perms []*PermissionRole) bool {
	return !rh.hasDirectDeny(perms) && rh.hasVirtualAllow(perms)
}

func (rh *RolesHierarchy) hasDirectDeny(perms []*PermissionRole) bool {
	var denyHoist, allowedHoist uint8
	for _, pr := range perms {
		for _, r := range rh.LeadingRoles {
			if r != pr.RoleID {
				continue
			}

			if pr.Allowed {
				allowedHoist = max(allowedHoist, pr.Hoist)
			} else {
				denyHoist = max(denyHoist, pr.Hoist)
			}
		}
	}
	return denyHoist > allowedHoist
}

func (rh *RolesHierarchy) hasVirtualAllow(perms []*PermissionRole) bool {
	for _, pr := range perms {
		for _, r := range rh.VirtualRoles {
			if r == pr.RoleID && pr.Allowed {
				return true
			}
		}
	}
	return false
}

type Role struct {
	ID    ID
	Name  RoleName
	Hoist RoleHoist
}

func NewRole(name string, hoist int) (*Role, error) {
	roleID, err := GenID()
	if err != nil {
		return nil, err
	}

	roleName, err := NewRoleName(name)
	if err != nil {
		return nil, err
	}

	return &Role{
		ID:   roleID,
		Name: roleName,
	}, nil
}

type RoleName string

func NewRoleName(str string) (RoleName, error) {
	if str == "" {
		return "", errors.New("role name cannot be empty")
	}

	if len(str) > 256 {
		return "", errors.New("role name must be at most 256 characters")
	}
	return RoleName(str), nil
}

type RoleHoist int

func NewRoleHoist(val int) (RoleHoist, error) {
	if val < 0 {
		return 0, errors.New("role hoist cannot be negative")
	}

	if val > 255 {
		return 0, errors.New("role hoist cannot be greater than 255")
	}

	return RoleHoist(val), nil
}
