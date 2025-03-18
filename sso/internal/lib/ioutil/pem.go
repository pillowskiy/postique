package ioutil

import (
	"encoding/pem"
	"fmt"
	"os"
)

type PemType string

const (
	PemTypePublic  PemType = "PUBLIC KEY"
	PemTypePrivate PemType = "PRIVATE KEY"
)

func DecodePem(path string, pemType PemType) ([]byte, error) {
	pemData, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read pem file: %v", err)
	}

	block, _ := pem.Decode(pemData)
	if block == nil {
		return nil, fmt.Errorf("failed to parse pem block")
	}

	if string(block.Type) != string(pemType) {
		return nil, fmt.Errorf("expected pem block of type %s, but got %s", pemType, block.Type)
	}

	return block.Bytes, nil
}

func MustDecodePem(path string, pemType PemType) []byte {
	keyBytes, err := DecodePem(path, pemType)
	if err != nil {
		panic(fmt.Sprintf("error decoding pem file: %v", err))
	}
	return keyBytes
}
