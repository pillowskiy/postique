package storage

import (
	"context"
	"errors"
)

var (
	ErrUserNotFound = errors.New("user not found")
	ErrAppNotFound  = errors.New("app not found")
)

type InTransactionalCall func(ctx context.Context) error

type Transactional interface {
	DoInTransaction(context.Context, InTransactionalCall) error
}
