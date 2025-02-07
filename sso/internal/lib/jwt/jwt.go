package jwt

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type MapClaims = jwt.MapClaims

func New(payload interface{}, secret string, duration time.Duration) (string, error) {
	claims := &MapClaims{
		"exp": time.Now().Add(duration).Unix(),
	}

	if err := decode(payload, claims); err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenStr, nil
}

func Verify(token, secret string) (interface{}, error) {
	jwtToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})
	if err != nil {
		return "", err
	}

	if !jwtToken.Valid {
		return "", errors.New("invalid token")
	}

	return jwtToken.Claims, nil
}

func VerifyAndScan(token, secret string, dest interface{}) error {
	payload, err := Verify(token, secret)
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

func decode(src interface{}, dest interface{}) error {
	tmp, err := json.Marshal(src)
	if err != nil {
		return fmt.Errorf("failed to marshal src: %w", err)
	}

	if err := json.Unmarshal(tmp, dest); err != nil {
		return fmt.Errorf("failed to unmarshal dest: %w", err)
	}

	return nil
}
