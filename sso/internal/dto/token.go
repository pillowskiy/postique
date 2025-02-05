package dto

import "time"

type TokenGenResult struct {
	TokenType   string
	Token       string
	AccessToken string
	ExpiresIn   time.Duration
}
