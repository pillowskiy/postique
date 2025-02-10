package server

import (
	"context"

	pb "github.com/pillowskiy/postique/pb/v1/sso"
	"github.com/pillowskiy/postique/sso/internal/delivery/grpc/interceptor"
	"github.com/pillowskiy/postique/sso/pkg/validator"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var permissionRulesMessages = ValidationRulesMap{
	"user_id.string.uuid": "User ID has incorrect format",
	"name.string.max_len": "Permission name should be less than {{.RuleValue}} characters",
}

type PermissionUseCase interface {
	HasPermission(ctx context.Context, userID string, permissionName string) (bool, error)
}

type permissionServer struct {
	pb.UnimplementedPermissionServer
	permUC PermissionUseCase
}

func RegisterPermissionServer(server *grpc.Server, permUC PermissionUseCase) {
	pb.RegisterPermissionServer(server, &permissionServer{permUC: permUC})
}

func (s *permissionServer) HasPermission(ctx context.Context, req *pb.HasPermissionRequest) (*pb.HasPermissionResponse, error) {
	if err := validator.ValidateGRPC(req); err != nil {
		return nil, formatValidationError(err, permissionRulesMessages)
	}

	userID, err := interceptor.UserFromContext(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to get user from execution context")
	}

	hasPermission, err := s.permUC.HasPermission(ctx, userID, req.GetName())
	if err != nil {
		return nil, status.Error(codes.PermissionDenied, "permission denied")
	}

	return &pb.HasPermissionResponse{HasPermission: hasPermission}, nil
}

func (s *permissionServer) HasUserPermission(ctx context.Context, req *pb.HasUserPermissionRequest) (*pb.HasUserPermissionResponse, error) {
	if err := validator.ValidateGRPC(req); err != nil {
		return nil, formatValidationError(err, permissionRulesMessages)
	}

	hasPermission, err := s.permUC.HasPermission(ctx, req.GetUserId(), req.GetName())
	if err != nil {
		return nil, status.Error(codes.PermissionDenied, "permission denied")
	}

	return &pb.HasUserPermissionResponse{HasPermission: hasPermission}, nil
}
