package interceptor

import (
	"context"
	"errors"
	"log"
	"log/slog"
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
	Verify(ctx context.Context, token string) (*dto.AuthUser, error)
}

type PermissionUseCase interface {
	HasPermission(ctx context.Context, userID string, permissionName string) (bool, error)
}

func UnaryWithAuth(authUC AuthUseCase) UnarySpecificMethod {
	return unarySpecificMethod(func(ctx context.Context, req any, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp any, err error) {
		token, err := TokenFromContext(ctx)
		if err != nil {
			return nil, status.Error(codes.Unauthenticated, err.Error())
		}

		user, err := authUC.Verify(ctx, token)
		if err != nil {
			log.Printf("Auth verify: %v", err)
			return nil, status.Error(codes.Unauthenticated, "failed to verify token")
		}

		ctx = context.WithValue(ctx, authUserKey, *user)
		return handler(ctx, req)
	})
}

func UnarySelfOrHasPermission(permUC PermissionUseCase, log *slog.Logger, perm string) UnarySpecificMethod {
	type userIdHolder struct {
		UserID string
	}

	return unarySpecificMethod(func(ctx context.Context, req any, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp any, err error) {
		const op = "grpc.UnaryCanEditUsers"
		log := log.With(slog.String("op", op), slog.String("permission", perm))

		user, err := UserFromContext(ctx)
		if err != nil {
			log.Error("Failed to get user from context, please make sure that auth interceptor is used", slog.String("error", err.Error()))
			return nil, status.Error(codes.Internal, "failed to get executor from request")
		}
		log = log.With(slog.Any("user", user))

		holder, ok := req.(*userIdHolder)
		if !ok {
			log.Error("Request is not of expected type userIdHolder")
			return nil, status.Error(codes.Internal, "invalid request type")
		}
		log = log.With(slog.String("target", holder.UserID))

		isSelfAction := user.UserID == holder.UserID
		hasPermission, err := permUC.HasPermission(ctx, user.UserID, perm)
		if err != nil {
			log.Error("Failed to check user permissions", slog.String("error", err.Error()))
			hasPermission = false
		}

		if !isSelfAction && !hasPermission {
			log.Warn("User does not have permission to perform action")
			return nil, status.Error(codes.PermissionDenied, "you cannot ")
		}

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

func UserFromContext(ctx context.Context) (*dto.AuthUser, error) {
	user, ok := ctx.Value(authUserKey).(dto.AuthUser)
	if !ok {
		return nil, errors.New("cannot infer user id from incoming context")
	}

	return &user, nil
}
