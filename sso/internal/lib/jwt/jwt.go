package jwt

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type (
	MapClaims = jwt.MapClaims
)

var methods = map[SigningMethod]jwt.SigningMethod{
	SigningMethodEdDSA: jwt.SigningMethodEdDSA,
	SigningMethodHS256: jwt.SigningMethodHS256,
}

func New(payload any, s Secret, dur time.Duration) (string, error) {
	method, ok := methods[s.Method()]
	if !ok {
		return "", errors.New("unknown signing method provided")
	}

	claims := &MapClaims{
		"exp": time.Now().Add(dur).Unix(),
	}

	if err := decode(payload, claims); err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(method, claims)
	tokenStr, err := token.SignedString(s.SignKey())
	if err != nil {
		return "", err
	}

	return tokenStr, nil
}

func Verify(token string, s Secret) (any, error) {
	method, ok := methods[s.Method()]
	if !ok {
		return "", errors.New("unknown signing method provided")
	}

	jwtToken, err := jwt.Parse(token, func(token *jwt.Token) (any, error) {
		if token.Method.Alg() != method.Alg() {
			return nil, fmt.Errorf("unexpected signing method algorithm: %v", token.Header["alg"])
		}

		return s.VerifyKey(), nil
	})
	if err != nil {
		return "", err
	}

	if !jwtToken.Valid {
		return "", errors.New("invalid token")
	}

	return jwtToken.Claims, nil
}

func VerifyAndScan(token string, s Secret, dest any) error {
	payload, err := Verify(token, s)
	if err != nil {
		return err
	}

	claims, ok := payload.(MapClaims)
	if !ok {
		return fmt.Errorf("failed to assert payload as jwt.MapClaims")
	}

	if err := decode(claims, dest); err != nil {
		return fmt.Errorf("failed to decode payload: %w", err)
	}

	return nil
}

func decode(src any, dest any) error {
	tmp, err := json.Marshal(src)
	if err != nil {
		return fmt.Errorf("failed to marshal src: %w", err)
	}

	if err := json.Unmarshal(tmp, dest); err != nil {
		return fmt.Errorf("failed to unmarshal dest: %w", err)
	}

	return nil
}
