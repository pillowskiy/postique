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

type ProfileUseCase interface {
	UpdateProfile(ctx context.Context, userID string, input *dto.UpdateProfileInput) (*dto.Profile, error)
}

type profileServer struct {
	pb.UnimplementedProfileServer
    profileUC ProfileUseCase
}

func RegisterProfileServer(server *grpc.Server, profileUC ProfileUseCase) {
	pb.RegisterProfileServer(server, &profileServer{profileUC: profileUC})
}

func (s *profileServer) UpdateProfile(ctx context.Context, req *pb.UpdateProfileRequest) (*pb.UpdateProfileResponse, error) {
	dto := &dto.UpdateProfileInput{
        Username: req.GetUsername(),
        Bio: req.GetBio(),
        AvatarPath: req.GetAvatarPath(),
    }

	res, err := s.profileUC.UpdateProfile(ctx, req.GetUserId(),  dto)
	if err != nil {
		return nil, s.parseUseCaseErr(err)
	}

	return &pb.UpdateProfileResponse{Profile: &pb.UserProfile{
        Username: res.Username,
        Bio: res.Bio,
        AvatarPath: res.AvatarPath,
    }}, nil
}

func (s *profileServer) parseUseCaseErr(err error) error {
	switch {
	case errors.Is(err, usecase.ErrProfileNotFound):
		return status.Error(codes.NotFound, "profile not found")
	default:
		return parseUseCaseException(err)
	}
}
