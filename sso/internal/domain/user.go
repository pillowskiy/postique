package domain

import (
	"errors"

	"github.com/pillowskiy/postique/sso/internal/domain/service/crypto"
)

type User struct {
	ID       ID
	Email    Email
	Password Password
}

func NewUser(email, password string) (*User, error) {
	userEmail, err := NewEmail(email)
	if err != nil {
		return nil, err
	}

	userPwd, err := NewPassword(password)
	if err != nil {
		return nil, err
	}

	userID, err := GenID()
	if err != nil {
		return nil, err
	}

	user := &User{
		ID:       userID,
		Email:    userEmail,
		Password: userPwd,
	}

	return user, nil
}

type Password []byte

func NewPassword(str string) (Password, error) {
	pwd, err := crypto.Hash(str)
	return Password(pwd), err
}

func (p Password) Compare(str string) (err error) {
	return crypto.Compare(p, str)
}

type Email string

func NewEmail(str string) (Email, error) {
	if str == "" {
		return "", errors.New("email cannot be empty")
	}

	return Email(str), nil
}
