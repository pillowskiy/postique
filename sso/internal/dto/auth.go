package dto

type RegisterUserInput struct {
	Email    string
	Password string
}

type RegisterUserResult struct {
	UserID string
}

type LoginUserInput struct {
	Email    string
	Password string
	AppName  string
}

type LoginUserResult = TokenGenResult

type RefreshSessionResult = TokenGenResult
