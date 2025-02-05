package server

import (
	"context"
	"errors"

	pb "github.com/pillowskiy/postique/pb/v1/sso"
	"github.com/pillowskiy/postique/sso/internal/dto"
	"github.com/pillowskiy/postique/sso/internal/usecase"
	"github.com/pillowskiy/postique/sso/pkg/validator"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var authRulesMessages = ValidationRulesMap{
	"email.string.email_empty": "Email address shouldn't be empty",
	"email.string.email":       "Email has incorrect format",
	"email.string.max_len":     "The length of email address should be less than {{.RuleValue}}",
	"password.string.min_len":  "Password should be longer than {{.RuleValue}} symbols",
	"password.string.max_len":  "Password should be less than {{.RuleValue}} symbols",
	"app_id.string.uuid":       "App ID has incorrect format",
	"user_id.string.uuid":      "User ID has incorrect format",
}

type AuthUseCase interface {
	Login(ctx context.Context, dto *dto.LoginUserInput) (*dto.Session, error)
	Register(ctx context.Context, dto *dto.RegisterUserInput) (*dto.RegisterUserResult, error)
}

type authServer struct {
	pb.UnimplementedAuthServer
	authUC AuthUseCase
}

func RegisterAuthServer(server *grpc.Server, authUC AuthUseCase) {
	pb.RegisterAuthServer(server, &authServer{authUC: authUC})
}

func (s *authServer) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
	if err := validator.ValidateGRPC(req); err != nil {
		return nil, formatValidationError(err, authRulesMessages)
	}

	dto := &dto.LoginUserInput{
		Email:    req.GetEmail(),
		Password: req.GetPassword(),
		AppName:  req.GetAppName(),
	}

	session, err := s.authUC.Login(ctx, dto)
	if err != nil {
		return nil, s.parseUseCaseErr(err)
	}

	return &pb.LoginResponse{
		Session: &pb.Session{
			RefreshToken: session.Token,
			AccessToken:  session.AccessToken,
			TokenType:    session.TokenType,
			ExpiresIn:    int64(session.ExpiresIn.Seconds()),
		},
	}, nil
}

func (s *authServer) Register(ctx context.Context, req *pb.RegisterRequest) (*pb.RegisterResponse, error) {
	if err := validator.ValidateGRPC(req); err != nil {
		return nil, formatValidationError(err, authRulesMessages)
	}

	dto := &dto.RegisterUserInput{
		Email:    req.GetEmail(),
		Password: req.GetPassword(),
	}

	res, err := s.authUC.Register(ctx, dto)
	if err != nil {
		return nil, s.parseUseCaseErr(err)
	}

	return &pb.RegisterResponse{UserId: res.UserID}, nil
}

func (s *authServer) parseUseCaseErr(err error) error {
	switch {
	case errors.Is(err, usecase.ErrUserAlreadyExists):
		return status.Error(codes.AlreadyExists, "user already exists")
	case errors.Is(err, usecase.ErrInvalidCredentials):
		return status.Error(codes.Unauthenticated, "invalid credentials")
	default:
		return status.Error(codes.Internal, "internal error occurred")
	}
}
