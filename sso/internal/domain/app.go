package domain

import (
	"errors"

	"github.com/pillowskiy/postique/sso/internal/domain/service/crypto"
)

type App struct {
	ID     ID
	Name   Name
	Secret Secret
}

func NewApp(name, secret, key string) (*App, error) {
	appID, err := GenID()
	if err != nil {
		return nil, err
	}

	appName, err := NewName(name)
	if err != nil {
		return nil, err
	}

	appSecret, err := NewSecret(secret, key)
	if err != nil {
		return nil, err
	}

	return &App{ID: appID, Name: appName, Secret: appSecret}, nil
}

type Name string

func NewName(str string) (Name, error) {
	return Name(str), nil
}

type Secret string

func NewSecret(plain, key string) (Secret, error) {
	if key == "" {
		return "", errors.New("secret key cannot be empty")
	}

	secret, err := crypto.EncryptStr(plain, key)
	if err != nil {
		return "", errors.New("failed to encrypt secret")
	}

	return Secret(secret), nil
}

func (s Secret) AsString(key string) (string, error) {
	plain, err := crypto.DecryptStr(string(s), key)
	if err != nil {
		return "", errors.New("failed to decrypt secret")
	}
	return plain, nil
}
