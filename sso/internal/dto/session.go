package dto

import "time"

type AppSessionMeta struct {
	AppID       string
	Fingerprint *string
}

type AppSession struct {
	AppSessionMeta
	Token string
}

type Session struct {
	TokenType   string
	ExpiresIn   time.Duration
	Token       string
	AccessToken string
}

type UserPayload struct {
	UserID string `json:"uid"`
}
