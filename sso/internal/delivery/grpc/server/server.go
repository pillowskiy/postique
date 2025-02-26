package server

import (
	"errors"
	"strings"

	"github.com/pillowskiy/postique/sso/internal/usecase"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func parseUseCaseException(err error) error {
	switch {
	case errors.Is(err, usecase.ErrInvalidInput):
		msg := err.Error()
		if strings.HasPrefix(msg, usecase.ErrInvalidInput.Error()) {
			return status.Error(codes.InvalidArgument, msg)
		}
		fallthrough
	default:
		return status.Error(codes.Internal, "internal error occurred")
	}
}
