package dto

import "time"

type Session struct {
	TokenType   string
	ExpiresIn   time.Duration
	Token       string
	AccessToken string
}

type UserPayload struct {
	UserID string
}
