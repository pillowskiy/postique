package redis

import (
	"github.com/pillowskiy/postique/sso/internal/domain"
	redisClient "github.com/redis/go-redis/v9"
)

func NewUserCache(client *redisClient.Client) *Cache[domain.User] {
	return NewCache[domain.User](client)
}
