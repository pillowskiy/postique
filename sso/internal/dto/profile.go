package dto

import "time"

type CreateProfileInput struct {
	UserID   string
	Username string
	Email    string
	Bio      string
}

type UpdateProfileInput struct {
	AvatarPath string
	Username   string
	Bio        string
}

type Profile struct {
	UserID     string
	Username   string
	AvatarPath string
	Bio        string
	CreatedAt  time.Time
}
