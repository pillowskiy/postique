package domain

import (
	"errors"
	"time"

	"github.com/pillowskiy/postique/sso/internal/lib/gen"
)

type UserProfile struct {
	UserID     ID         `db:"user_id"`
	Username   Username   `db:"username"`
	AvatarPath AvatarPath `db:"avatar_path"`
	Bio        Bio        `db:"bio"`
	CreatedAt  time.Time  `db:"created_at"`
}

func NewUserProfile(userID PID, username, bio string) (*UserProfile, error) {
	uid, err := NewID(userID)
	if err != nil {
		return nil, err
	}

	uname, err := NewUsername(username)
	if err != nil {
		return nil, err
	}

	ubio, err := NewBio(bio)
	if err != nil {
		return nil, err
	}

	avatarPath, err := GenAvatarPath()
	if err != nil {
		return nil, err
	}

	return &UserProfile{
		UserID:     uid,
		Username:   uname,
		AvatarPath: avatarPath,
		Bio:        ubio,
		CreatedAt:  time.Now(),
	}, nil
}

type Username string

func NewUsername(str string) (Username, error) {
	return Username(str), nil
}

type AvatarPath string

func NewAvatarPath(str string) (AvatarPath, error) {
	return AvatarPath(str), nil
}

func GenAvatarPath() (AvatarPath, error) {
	path, err := gen.GenerateRand256()
	return AvatarPath(path), err
}

type Bio string

func NewBio(str string) (Bio, error) {
	if len(str) > 1024 {
		return "", errors.New("bio should not exceed 1024 characters")
	}

	return Bio(str), nil
}
