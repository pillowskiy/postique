package gen

import (
	"fmt"

	"github.com/google/uuid"
)

func GenerateUUID() (string, error) {
	uuid, err := uuid.NewRandom()
	if err != nil {
		return "", fmt.Errorf("failed to generate id: %w", err)
	}
	return uuid.String(), nil
}

func ParseUUID(str string) (string, error) {
	uuid, err := uuid.Parse(str)
	if err != nil {
		return "", fmt.Errorf("invalid id format: %w", err)
	}
	return uuid.String(), nil
}
