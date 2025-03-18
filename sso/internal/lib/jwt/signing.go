package jwt

import (
	"crypto/ed25519"
)

type SigningMethod string

var (
	SigningMethodEdDSA SigningMethod = "EdDSA"
	SigningMethodHS256 SigningMethod = "HS256"
)

type Secret interface {
	SignKey() any
	VerifyKey() any
	Method() SigningMethod
}

type jwtMethod struct {
	method SigningMethod
}

func (s jwtMethod) Method() SigningMethod {
	return s.method
}

type hmacJwtSecret struct {
	jwtMethod
	key []byte
}

func (s hmacJwtSecret) VerifyKey() any {
	return s.key
}

func (s hmacJwtSecret) SignKey() any {
	return s.key
}

type edDSAJwtSecret struct {
	jwtMethod
	privateKey ed25519.PrivateKey
	publicKey  ed25519.PublicKey
}

func (s edDSAJwtSecret) VerifyKey() any {
	return s.publicKey
}

func (s edDSAJwtSecret) SignKey() any {
	return s.privateKey
}

func EdDSASecret(publicKey, privateKey []byte) Secret {
	return edDSAJwtSecret{
		jwtMethod: jwtMethod{
			method: SigningMethodEdDSA,
		},
		publicKey:  publicKey,
		privateKey: privateKey,
	}
}

func HS256Secret(key []byte) Secret {
	return hmacJwtSecret{
		jwtMethod: jwtMethod{
			method: SigningMethodHS256,
		},
		key: key,
	}
}
