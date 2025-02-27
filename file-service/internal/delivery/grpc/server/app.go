package server

import (
	"context"
	"errors"
	"strings"

	"github.com/pillowskiy/postique/files/internal/usecase"
	pb "github.com/pillowskiy/postique/pb/v1/files"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type AppUseCase interface {
	CreateApp(ctx context.Context, name, bucket string) (string, error)
}

type appServer struct {
	pb.UnimplementedAppServer
	appUC AppUseCase
}

func RegisterAppServer(server *grpc.Server, appUC AppUseCase) {
	pb.RegisterAppServer(server, &appServer{appUC: appUC})
}

func (s *appServer) CreateApp(ctx context.Context, req *pb.CreateAppRequest) (*pb.CreateAppResponse, error) {
	token, err := s.appUC.CreateApp(ctx, req.Name, req.Bucket)
	if err != nil {
		return nil, s.parseUseCaseErr(err)
	}

	return &pb.CreateAppResponse{Token: token}, nil
}

func (s *appServer) parseUseCaseErr(err error) error {
	switch {
	case errors.Is(err, usecase.ErrAppAlreadyExists):
		return status.Error(codes.AlreadyExists, "app already exists")
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
