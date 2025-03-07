package interceptor

import (
	"context"
	"errors"
	"log/slog"
	"strings"
	"time"

	"github.com/pillowskiy/postique/files/internal/dto"
	"github.com/pillowskiy/postique/files/internal/usecase"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

type key struct{}

var appPayloadKey = key{}

type AuthAppUseCase interface {
	DecryptApp(ctx context.Context, token string) (*dto.AppPayload, error)
}

func UnaryWithAuth(authUC AuthAppUseCase, log *slog.Logger) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req any, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (any, error) {
		const op = "interceptor.UnaryWithAuth"
		log := log.With(slog.String("method", info.FullMethod), slog.String("op", op))
		defer func(start time.Time) {
			log.Info("Handled", slog.String("elapsed", time.Since(start).String()))
		}(time.Now())

		token, err := TokenFromContext(ctx)
		if err != nil {
			log.Error("failed to get token from context", slog.String("error", err.Error()))
			return nil, status.Error(codes.Unauthenticated, "invalid token")
		}

		payload, err := authUC.DecryptApp(ctx, token)
		if err != nil {
			if errors.Is(err, usecase.ErrAppNotFound) {
                log.Warn("app not found")
				return nil, status.Error(codes.Unauthenticated, "app not found")
			}
			log.Error("failed to decrypt token", slog.String("error", err.Error()))
			return nil, status.Error(codes.Internal, "internal server error")
		}

		ctx = context.WithValue(ctx, appPayloadKey, *payload)
		return handler(ctx, req)
	}
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

func AppFromContext(ctx context.Context) (*dto.AppPayload, error) {
	user, ok := ctx.Value(appPayloadKey).(dto.AppPayload)
	if !ok {
		return nil, errors.New("cannot infer user id from incoming context")
	}

	return &user, nil
}
