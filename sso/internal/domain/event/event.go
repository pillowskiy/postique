package event

import (
	"github.com/pillowskiy/postique/sso/internal/domain"
)

type EventPublisher interface {
	Publish(event Event) error
}

type EventName string

var (
	EventNameUserRegistered EventName = "user_registered"
	EventNameUserProfile    EventName = "user_profile"
)

type Event struct {
	Name    EventName
	Payload any
}

type UserRegisteredEventPayload struct {
	ID         string `json:"id"`
	Email      string `json:"email"`
	Username   string `json:"username"`
	AvatarPath string `json:"avatarPath"`
}

func NewUserRegisteredEvent(user *domain.User, avatarPath, username string) Event {
	return Event{
		Name: EventNameUserRegistered,
		Payload: UserRegisteredEventPayload{
			ID:         string(user.ID),
			Username:   username,
			AvatarPath: avatarPath,
			Email:      string(user.Email),
		},
	}
}

type UserProfileEventPayload struct {
	ID         string `json:"id"`
	Username   string `json:"username"`
	AvatarPath string `json:"avatarPath"`
}

func NewUserProfileEvent(profile *domain.UserProfile) Event {
	return Event{
		Name: EventNameUserProfile,
		Payload: UserProfileEventPayload{
			ID:         string(profile.UserID),
			Username:   string(profile.Username),
			AvatarPath: profile.AvatarPath.String(),
		},
	}
}
