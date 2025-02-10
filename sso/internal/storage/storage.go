package storage

import (
	"context"
	"errors"
)

var (
	ErrUserNotFound    = errors.New("user not found")
	ErrAppNotFound     = errors.New("app not found")
	ErrSessionNotFound = errors.New("session not found")

	ErrPermissionNotFound = errors.New("permission not found")
)

type InTransactionalCall func(ctx context.Context) error

type Transactional interface {
	DoInTransaction(context.Context, InTransactionalCall) error
}
