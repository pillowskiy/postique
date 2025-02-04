package server

import (
	"context"

	pb "github.com/pillowskiy/postique/pb/v1/sso"
	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/dto"
	"github.com/pillowskiy/postique/sso/pkg/validator"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var appRulesMessages = ValidationRulesMap{
	"name.string.min_len": "App name should be at least {{.RuleValue}} characters",
	"name.string.max_len": "App name should be less than {{.RuleValue}} characters",
}

type AppUseCase interface {
	CreateApp(ctx context.Context, app *dto.CreateAppDTO) (domain.ID, error)
}

type appServer struct {
	pb.UnimplementedAppServer
	appUC AppUseCase
}

func RegisterAppServer(server *grpc.Server, appUC AppUseCase) {
	pb.RegisterAppServer(server, &appServer{appUC: appUC})
}

func (s *appServer) CreateApp(ctx context.Context, req *pb.CreateAppRequest) (*pb.CreateAppResponse, error) {
	if err := validator.ValidateGRPC(req); err != nil {
		return nil, formatValidationError(err, appRulesMessages)
	}

	dto := &dto.CreateAppDTO{
		Name: req.GetName(),
	}

	id, err := s.appUC.CreateApp(ctx, dto)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Unknown error occurred, please wait and try again later")
	}

	return &pb.CreateAppResponse{AppId: string(id)}, nil
}
