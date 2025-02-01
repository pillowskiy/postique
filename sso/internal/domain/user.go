package domain

import (
	"golang.org/x/crypto/bcrypt"
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

type Password string

func NewPassword(str string) (Password, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(str), bcrypt.DefaultCost)
	return Password(hashedPassword), err
}

type Email string

func NewEmail(str string) (Email, error) {
	return Email(str), nil
}
