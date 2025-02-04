package crypto

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
)

func Hash(str string) ([]byte, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(str), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to generate from password")
	}

	return hashedPassword, nil
}

func Compare(hash []byte, value string) (err error) {
	if bErr := bcrypt.CompareHashAndPassword(hash, []byte(value)); bErr != nil {
		err = errors.New("hash doesn't match it previous state")
	}
	return
}
