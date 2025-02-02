package dto

import "github.com/pillowskiy/postique/sso/internal/domain"

type RegisterUserDTO struct {
	Email    string
	Password string
	AppID    domain.PID
}

type LoginUserDTO struct {
	Email    string
	Password string
	AppID    domain.PID
}

type IsAdminDTO struct {
	UserID domain.PID
}
