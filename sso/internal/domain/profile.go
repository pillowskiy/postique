package domain

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/pillowskiy/postique/sso/internal/lib/gen"
)

var supportedAvatarExt = map[string]struct{}{
	"png":  {},
	"jpg":  {},
	"jpeg": {},
	"webp": {},
	"avif": {},
	"bmp":  {},
}

type UserProfile struct {
	UserID     ID          `db:"user_id"`
	Username   Username    `db:"username"`
	AvatarPath *AvatarPath `db:"avatar_path"`
	Bio        Bio         `db:"bio"`
	CreatedAt  time.Time   `db:"created_at"`
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

	avatarPath, err := GenAvatarPath("")
	if err != nil {
		return nil, err
	}

	return &UserProfile{
		UserID:     uid,
		Username:   uname,
		AvatarPath: &avatarPath,
		Bio:        ubio,
		CreatedAt:  time.Now(),
	}, nil
}

type Username string

func NewUsername(str string) (Username, error) {
	if str == "" {
		return "", errors.New("username cannot be empty")
	}

	if len(str) > 256 {
		return "", errors.New("username must be at most 256 characters")
	}

	if len(str) < 3 {
		return "", errors.New("username must be at least 3 characters")
	}

	return Username(str), nil
}

type AvatarPath string

func NewAvatarPath(str string) (AvatarPath, error) {
	if str == "" {
		return "", errors.New("avatar path cannot be empty")
	}

	parts := strings.Split(str, ".")
	if len(parts) < 2 {
		return "", errors.New("avatar path must contain an extension")
	}

	ext := parts[len(parts)-1]
	if _, ok := supportedAvatarExt[ext]; !ok {
		return "", errors.New("unsupported avatar extension provided")
	}

	return AvatarPath(str), nil
}

func GenAvatarPath(srcName string) (AvatarPath, error) {
	if srcName == "" {
		return AvatarPath(""), nil
	}

	parts := strings.Split(srcName, ".")
	ext := parts[len(parts)-1]

	str, err := gen.GenerateRand256()
	if err != nil {
		return "", fmt.Errorf("%w: %w", ErrPrivate, err)
	}

	path := fmt.Sprintf("%s.%s", str, ext)
	return AvatarPath(path), err
}

func (ap *AvatarPath) String() string {
	if ap == nil {
		return ""
	}

	return string(*ap)
}

type Bio string

func NewBio(str string) (Bio, error) {
	if len(str) > 1024 {
		return "", errors.New("bio should not exceed 1024 characters")
	}

	return Bio(str), nil
}
