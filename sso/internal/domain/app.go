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
	return Name(str), nil
}

type Secret string

func NewSecret(plain, key string) (Secret, error) {
	if key == "" {
		return "", errors.New("secret key cannot be empty")
	}

	secret, err := crypto.EncryptStr(plain, key)
	if err != nil {
		return "", fmt.Errorf("failed to encrypt secret: %w", err)
	}

	return Secret(secret), nil
}

func (s Secret) Decrypt(key string) (*DecryptedSecret, error) {
	plain, err := crypto.DecryptStr(string(s), key)
	if err != nil {
		return nil, errors.New("failed to decrypt secret")
	}
	return NewDecryptedSecret(plain), nil
}

type DecryptedSecret struct {
	val      string
	released bool
}

func NewDecryptedSecret(s string) *DecryptedSecret {
	return &DecryptedSecret{val: s}
}

func (k *DecryptedSecret) Release() (string, error) {
	if k.released {
		return "", errors.New("already released")
	}

	if k.val == "" {
		return "", errors.New("secret is empty")
	}

	k.released = true
	s := k.val
	k.val = ""
	return s, nil
}
