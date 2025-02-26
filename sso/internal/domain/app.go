package domain

import (
	"errors"
	"fmt"

	"github.com/pillowskiy/postique/sso/internal/lib/crypto"
	"github.com/pillowskiy/postique/sso/internal/lib/gen"
)

type App struct {
	ID     ID
	Name   Name
	Secret Secret
}

func NewApp(name, decryptKey string) (*App, error) {
	appID, err := GenID()
	if err != nil {
		return nil, err
	}

	appName, err := NewName(name)
	if err != nil {
		return nil, err
	}

	secret, err := gen.GenerateRand256()
	if err != nil {
		return nil, err
	}

	appSecret, err := NewSecret(secret, decryptKey)
	if err != nil {
		return nil, err
	}

	return &App{ID: appID, Name: appName, Secret: appSecret}, nil
}

type Name string

func NewName(str string) (Name, error) {
	if str == "" {
		return "", errors.New("app name cannot be empty")
	}

	if len(str) > 256 {
		return "", errors.New("app name must be at most 256 characters")
	}
	return Name(str), nil
}

type Secret string

func NewSecret(plain, key string) (Secret, error) {
	if len(key)%16 != 0 {
		return "", errors.New("app secret key must be a multiple of 16 characters")
	}

	if plain == "" {
		return "", errors.New("app secret cannot be empty")
	}

	if len(plain) > 256 {
		return "", errors.New("app secret must be at most 256 characters")
	}

	secret, err := crypto.EncryptStr(plain, key)
	if err != nil {
		return "", fmt.Errorf("%w - failed to encrypt secret: %w", ErrPrivate, err)
	}

	return Secret(secret), nil
}

func (s Secret) Decrypt(key string) (string, error) {
	plainSecret, err := crypto.DecryptStr(string(s), key)
	if err != nil {
		return "", fmt.Errorf("%w - failed to decrypt secret: %w", ErrPrivate, err)
	}
	return plainSecret, nil
}
