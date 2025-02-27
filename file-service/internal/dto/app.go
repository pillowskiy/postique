package dto

type AppPayload struct {
	Name   string `json:"name"`
	Bucket string `json:"bucket"`
	IAT    int64  `json:"iat"`
}
