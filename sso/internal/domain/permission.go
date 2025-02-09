package domain

type Permission struct {
	ID   ID
	Name PermName
}

type PermissionRole struct {
	RoleID  ID    `db:"role_id"`
	Allowed bool  `db:"allowed"`
	Hoist   uint8 `db:"hoist"`
}

func NewPermission(name string) (*Permission, error) {
	id, err := GenID()
	if err != nil {
		return nil, err
	}

	permName, err := NewPermName(name)
	if err != nil {
		return nil, err
	}

	return &Permission{ID: id, Name: permName}, nil
}

type PermName string

func NewPermName(str string) (PermName, error) {
	return PermName(str), nil
}
