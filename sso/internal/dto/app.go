package dto

type AppResult struct {
	ID   string
	Name string
}

type CreateAppInput struct {
	Name string
}

type CreateAppResult struct {
	AppID string
}
