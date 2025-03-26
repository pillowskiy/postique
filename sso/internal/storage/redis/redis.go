package redis

import (
	"context"
	"encoding/json"
	"fmt"
	"reflect"
	"time"

	redisClient "github.com/redis/go-redis/v9"
)

type Cache[T interface{}] struct {
	client *redisClient.Client
	name   string
}

func NewCache[T interface{}](client *redisClient.Client) *Cache[T] {
	return &Cache[T]{client: client, name: reflect.TypeOf(new(T)).Name()}
}

func (c *Cache[T]) Get(ctx context.Context, id string) (*T, error) {
	op := fmt.Sprintf("redis.Cache[%s].Get", c.name)

	bytes, err := c.client.Get(ctx, id).Bytes()
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	data := new(T)
	if err = json.Unmarshal(bytes, data); err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return data, nil
}

func (c *Cache[T]) Set(ctx context.Context, id string, data *T, ttl int) error {
	op := fmt.Sprintf("redis.Cache[%s].Set", c.name)

	bytes, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	exp := time.Duration(ttl) * time.Second
	err = c.client.Set(ctx, id, bytes, exp).Err()
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}
	return nil
}

func (c *Cache[T]) Del(ctx context.Context, id string) error {
	op := fmt.Sprintf("redis.Cache[%s].Del", c.name)
	if err := c.client.Del(ctx, id).Err(); err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}
	return nil
}
