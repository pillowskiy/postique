package interceptor

import (
	"context"
	"errors"
	"strings"

	"google.golang.org/grpc/metadata"
)

func TokenFromContext(ctx context.Context) (string, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return "", errors.New("missing metadata")
	}

	values := md.Get("authorization")
	if len(values) == 0 {
		return "", errors.New("missing authorization metadata")
	}

	parts := strings.Split(values[0], " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return "", errors.New("invalid token provided")
	}

	return parts[1], nil
}
