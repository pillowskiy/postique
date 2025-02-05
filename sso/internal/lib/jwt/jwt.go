package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func NewToken(userID string, secret string, duration time.Duration) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["uid"] = userID
	claims["exp"] = time.Now().Add(duration).Unix()

	tokenStr, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenStr, nil
}
