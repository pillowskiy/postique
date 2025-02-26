package domain

import (
	"fmt"
	"time"
)

type Session struct {
	ID          ID          `db:"id"`
	AppID       ID          `db:"app_id"`
	Token       string      `db:"token"`
	Fingerprint Fingerprint `db:"fingerprint"`
	Valid       bool        `db:"valid"`
	CreatedAt   time.Time   `db:"created_at"`
}

func NewSession(token string, fingerprint *string, appID string) (*Session, error) {
	sessID, err := GenID()
	if err != nil {
		return nil, err
	}

	sessAppID, err := NewID(appID)
	if err != nil {
		return nil, err
	}

	sessFP, err := NewFingerprint(fingerprint)
	if err != nil {
		return nil, err
	}

	return &Session{
		ID:          sessID,
		AppID:       sessAppID,
		Token:       token,
		Fingerprint: sessFP,
		CreatedAt:   time.Now(),
		Valid:       true,
	}, nil
}

func (s *Session) Invalidate() {
	s.Valid = false
}

func (s *Session) IsValid() bool {
	return s.Valid
}

type Fingerprint *string

func NewFingerprint(str *string) (Fingerprint, error) {
	if str != nil {
		if *str == "" {
			return nil, fmt.Errorf("fingerprint cannot be empty")
		}

		if len(*str) > 256 {
			return nil, fmt.Errorf("fingerprint must be at most 256 characters")
		}
	}

	return Fingerprint(str), nil
}
