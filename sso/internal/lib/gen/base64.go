package gen

import (
	"crypto/rand"
	"encoding/base64"
)

func GenerateRand256() (string, error) {
	return randomBase64(32)
}

func randomBase64(size int) (string, error) {
	key := make([]byte, size)
	if _, err := rand.Read(key); err != nil {
		return "", err
	}

	return base64.StdEncoding.EncodeToString(key), nil
}
