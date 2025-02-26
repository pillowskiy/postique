package server

import (
	"context"
	"errors"

	pb "github.com/pillowskiy/postique/pb/v1/sso"
	"github.com/pillowskiy/postique/sso/internal/dto"
	"github.com/pillowskiy/postique/sso/internal/usecase"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type AppUseCase interface {
	CreateApp(ctx context.Context, app *dto.CreateAppInput) (*dto.CreateAppResult, error)
}

type appServer struct {
	pb.UnimplementedAppServer
	appUC AppUseCase
}

func RegisterAppServer(server *grpc.Server, appUC AppUseCase) {
	pb.RegisterAppServer(server, &appServer{appUC: appUC})
}

func (s *appServer) CreateApp(ctx context.Context, req *pb.CreateAppRequest) (*pb.CreateAppResponse, error) {
	dto := &dto.CreateAppInput{
		Name: req.GetName(),
	}

	res, err := s.appUC.CreateApp(ctx, dto)
	if err != nil {
		return nil, s.parseUseCaseErr(err)
	}

	return &pb.CreateAppResponse{AppId: res.AppID}, nil
}

func (s *appServer) parseUseCaseErr(err error) error {
	switch {
	case errors.Is(err, usecase.ErrAppAlreadyExists):
		return status.Error(codes.AlreadyExists, "application already exists")
	case errors.Is(err, usecase.ErrAppNotFound):
		return status.Error(codes.NotFound, "application not found")
	default:
		return parseUseCaseException(err)
	}
}
