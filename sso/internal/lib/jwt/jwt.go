package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/pillowskiy/postique/sso/internal/domain"
)

func NewToken(user *domain.User, decryptedSecret *domain.DecryptedSecret, duration time.Duration) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["uid"] = user.ID
	claims["email"] = user.Email
	claims["exp"] = time.Now().Add(duration).Unix()

	secret, err := decryptedSecret.Release()
	if err != nil {
		return "", err
	}

	tokenStr, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenStr, nil
}
