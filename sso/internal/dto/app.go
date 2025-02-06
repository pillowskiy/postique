package dto

type App struct {
	ID   string
	Name string
}

type CreateAppInput struct {
	Name string
}

type CreateAppResult struct {
	AppID string
}
