package dto

type RegisterUserDTO struct {
	Email    string
	Password string
}

type LoginUserDTO struct {
	Email    string
	Password string
	AppName  string
}
