package domain

import (
	"fmt"

	"github.com/google/uuid"
)

type ID string

func GenID() (ID, error) {
	uuid, err := uuid.NewRandom()
	if err != nil {
		return "", fmt.Errorf("failed to generate id: %w", err)
	}
	return ID(uuid.String()), nil
}

func NewID(str string) (ID, error) {
	uuid, err := uuid.Parse(str)
	if err != nil {
		return "", fmt.Errorf("invalid id format: %w", err)
	}

	return ID(uuid.String()), nil
}
