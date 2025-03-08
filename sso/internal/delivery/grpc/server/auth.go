package server

import (
	"context"
	"errors"

	pb "github.com/pillowskiy/postique/pb/v1/sso"
	"github.com/pillowskiy/postique/sso/internal/delivery/grpc/interceptor"
	"github.com/pillowskiy/postique/sso/internal/dto"
	"github.com/pillowskiy/postique/sso/internal/usecase"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type AuthUseCase interface {
	Login(ctx context.Context, dto *dto.LoginUserInput, fingerprint *string) (*dto.Session, error)
	Register(ctx context.Context, dto *dto.RegisterUserInput) (*dto.RegisterUserResult, error)
	Verify(ctx context.Context, token string) (*dto.AuthUser, error)
	Refresh(ctx context.Context, token string, fingerprint *string, appName string) (*dto.Session, error)
}

type authServer struct {
	pb.UnimplementedAuthServer
	authUC AuthUseCase
}

func RegisterAuthServer(server *grpc.Server, authUC AuthUseCase) {
	pb.RegisterAuthServer(server, &authServer{authUC: authUC})
}

func (s *authServer) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
	dto := &dto.LoginUserInput{
		Email:    req.GetEmail(),
		Password: req.GetPassword(),
		AppName:  req.GetAppName(),
	}

	session, err := s.authUC.Login(ctx, dto, nil)
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

func (s *authServer) Refresh(ctx context.Context, req *pb.RefreshRequest) (*pb.RefreshResponse, error) {
	session, err := s.authUC.Refresh(ctx, req.GetToken(), nil, req.GetAppName())
	if err != nil {
		return nil, s.parseUseCaseErr(err)
	}

	return &pb.RefreshResponse{
		Session: &pb.Session{
			RefreshToken: session.Token,
			AccessToken:  session.AccessToken,
			TokenType:    session.TokenType,
			ExpiresIn:    int64(session.ExpiresIn.Seconds()),
		},
	}, nil
}

func (s *authServer) Verify(ctx context.Context, req *pb.VerifyRequest) (*pb.VerifyResponse, error) {
	user, err := interceptor.UserFromContext(ctx)
	if err != nil {
		return nil, err
	}

	return &pb.VerifyResponse{
		UserId:     user.UserID,
		Username:   user.Username,
		AvatarPath: user.AvatarPath,
	}, nil
}

func (s *authServer) parseUseCaseErr(err error) error {
	switch {
	case errors.Is(err, usecase.ErrUserAlreadyExists):
		return status.Error(codes.AlreadyExists, "user already exists")
	case errors.Is(err, usecase.ErrInvalidCredentials):
		return status.Error(codes.Unauthenticated, "invalid credentials")
    case errors.Is(err, usecase.ErrInvalidSession):
        return status.Error(codes.Unauthenticated, "invalid session")
	default:
		return parseUseCaseException(err)
	}
}
