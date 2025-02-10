package interceptor

import (
	"context"
	"errors"
	"strings"

	"github.com/pillowskiy/postique/sso/internal/dto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

type key struct{}

var authUserKey key

type AuthUseCase interface {
	Verify(ctx context.Context, token string) (*dto.UserPayload, error)
}

type AuthInterceptorFactory struct {
	authUC AuthUseCase
}

func NewAuthInterceptorFactory(authUC AuthUseCase) *AuthInterceptorFactory {
	return &AuthInterceptorFactory{authUC}
}

func UnaryWithAuth(authUC AuthUseCase) UnarySpecificMethod {
	return unarySpecificMethod(func(ctx context.Context, req any, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp any, err error) {
		token, err := TokenFromContext(ctx)
		if err != nil {
			return nil, status.Error(codes.Unauthenticated, err.Error())
		}

		payload, err := authUC.Verify(ctx, token)
		if err != nil {
			return nil, status.Error(codes.Unauthenticated, "failed to verify token")
		}

		ctx = context.WithValue(ctx, authUserKey, payload.UserID)
		return handler(ctx, req)
	})
}

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

func UserFromContext(ctx context.Context) (string, error) {
	userID, ok := ctx.Value(authUserKey).(string)
	if !ok {
		return "", errors.New("cannot infer user id from incoming context")
	}

	return userID, nil
}
