package server

import (
	"context"

	pb "github.com/pillowskiy/postique/sso/gen/v1/sso"
	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/dto"
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
	Login(ctx context.Context, dto *dto.LoginUserDTO) (string, error)
	Register(ctx context.Context, dto *dto.RegisterUserDTO) (domain.ID, error)
	IsAdmin(ctx context.Context, dto *dto.IsAdminDTO) (bool, error)
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

	dto := &dto.LoginUserDTO{
		Email:    req.GetEmail(),
		Password: req.GetPassword(),
		AppID:    req.GetAppId(),
	}

	token, err := s.authUC.Login(ctx, dto)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Unknown error occurred, please wait and try again later")
	}

	return &pb.LoginResponse{Token: token}, nil
}

func (s *authServer) Register(ctx context.Context, req *pb.RegisterRequest) (*pb.RegisterResponse, error) {
	if err := validator.ValidateGRPC(req); err != nil {
		return nil, formatValidationError(err, authRulesMessages)
	}

	dto := &dto.RegisterUserDTO{
		Email:    req.GetEmail(),
		Password: req.GetPassword(),
	}

	userID, err := s.authUC.Register(ctx, dto)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Unknown error occurred, please wait and try again later")
	}

	return &pb.RegisterResponse{UserId: string(userID)}, nil
}

func (s *authServer) IsAdmin(ctx context.Context, req *pb.IsAdminRequest) (*pb.IsAdminResponse, error) {
	if err := validator.ValidateGRPC(req); err != nil {
		return nil, formatValidationError(err, authRulesMessages)
	}

	dto := &dto.IsAdminDTO{UserID: req.GetUserId()}

	isAdmin, err := s.authUC.IsAdmin(ctx, dto)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Unknown error occurred, please wait and try again later")
	}

	return &pb.IsAdminResponse{IsAdmin: isAdmin}, nil
}
