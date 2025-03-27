package server

import (
	"context"

	pb "github.com/pillowskiy/postique/pb/v1/sso"
	"github.com/pillowskiy/postique/sso/internal/delivery/grpc/interceptor"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type PermissionUseCase interface {
	HasPermission(ctx context.Context, userID string, permissionName string) (bool, error)
	SyncPermissions(ctx context.Context, permissionNames []string) error
}

type permissionServer struct {
	pb.UnimplementedPermissionServer
	permUC PermissionUseCase
}

func RegisterPermissionServer(server *grpc.Server, permUC PermissionUseCase) {
	pb.RegisterPermissionServer(server, &permissionServer{permUC: permUC})
}

func (s *permissionServer) SyncPermissions(ctx context.Context, req *pb.SyncPermissionsRequest) (*pb.SyncPermissionsResponse, error) {
	err := s.permUC.SyncPermissions(ctx, req.GetNames())
	if err != nil {
		return nil, parseUseCaseException(err)
	}

	return &pb.SyncPermissionsResponse{}, nil
}

func (s *permissionServer) HasPermission(ctx context.Context, req *pb.HasPermissionRequest) (*pb.HasPermissionResponse, error) {
	user, err := interceptor.UserFromContext(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to get user from execution context")
	}

	hasPermission, err := s.permUC.HasPermission(ctx, user.UserID, req.GetName())
	if err != nil {
		return nil, status.Error(codes.PermissionDenied, "permission denied")
	}

	return &pb.HasPermissionResponse{HasPermission: hasPermission}, nil
}

func (s *permissionServer) HasUserPermission(ctx context.Context, req *pb.HasUserPermissionRequest) (*pb.HasUserPermissionResponse, error) {
	hasPermission, err := s.permUC.HasPermission(ctx, req.GetUserId(), req.GetName())
	if err != nil {
		return nil, status.Error(codes.PermissionDenied, "permission denied")
	}

	return &pb.HasUserPermissionResponse{HasPermission: hasPermission}, nil
}
