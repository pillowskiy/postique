package usecase

import (
	"errors"
	"fmt"

	"github.com/pillowskiy/postique/sso/internal/domain"
)

var ErrInvalidInput = errors.New("invalid input")

func parseDomainErr(err error) error {
	if errors.Is(err, domain.ErrPrivate) {
		return err
	}

	return fmt.Errorf("%w: %w", ErrInvalidInput, err)
}
