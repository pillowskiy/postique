package domain

import (
	"errors"
	"regexp"
	"time"
)

var bucketPattern = regexp.MustCompile("^[a-z0-9-]+$")

type App struct {
	Name        AppName
	Bucket      Bucket
	GeneratedAt time.Time
}

func NewApp(name string, bucket string) (*App, error) {
	appName, err := NewAppName(name)
	if err != nil {
		return nil, err
	}

	appBucket, err := NewBucket(bucket)
	if err != nil {
		return nil, err
	}

	return &App{Name: appName, Bucket: appBucket, GeneratedAt: time.Now()}, nil
}

func ParseApp(name string, bucket string, generatedTimestamp int64) (*App, error) {
	appName, err := NewAppName(name)
	if err != nil {
		return nil, err
	}

	appBucket, err := NewBucket(bucket)
	if err != nil {
		return nil, err
	}

	// TEMP: generatedAt is always now
	return &App{Name: appName, Bucket: appBucket, GeneratedAt: time.Now()}, nil
}

type AppName string

func NewAppName(name string) (AppName, error) {
	if name == "" {
		return "", errors.New("app name cannot be empty")
	}

	if len(name) < 3 {
		return "", errors.New("app name should be at least 3 characters")
	}

	if len(name) > 255 {
		return "", errors.New("app name should be at most 255 characters")
	}

	return AppName(name), nil
}

func (n AppName) String() string {
	return string(n)
}

type Bucket string

func NewBucket(bucket string) (Bucket, error) {
	if bucket == "" {
		return "", errors.New("bucket cannot be empty")
	}

	if len(bucket) < 3 {
		return "", errors.New("bucket name should be at least 3 characters")
	}

	if len(bucket) > 255 {
		return "", errors.New("bucket name should be at most 255 characters")
	}

	if !bucketPattern.MatchString(bucket) {
		return "", errors.New("bucket name should only contain lowercase letters, numbers and hyphens")
	}

	return Bucket(bucket), nil
}

func (b Bucket) String() string {
	return string(b)
}
