package server

import (
	"bytes"
	"context"
	"errors"
	"strings"

	"github.com/pillowskiy/postique/files/internal/delivery/grpc/interceptor"
	"github.com/pillowskiy/postique/files/internal/dto"
	"github.com/pillowskiy/postique/files/internal/usecase"
	pb "github.com/pillowskiy/postique/pb/v1/files"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type FileUseCase interface {
	Upload(ctx context.Context, file *dto.File, bucket string) error
	Delete(ctx context.Context, name string, bucket string) error
}

type fileServer struct {
	pb.UnimplementedFileServer
	fileUC FileUseCase
}

func RegisterFileServer(server *grpc.Server, fileUC FileUseCase) {
	pb.RegisterFileServer(server, &fileServer{fileUC: fileUC})
}

func (s *fileServer) Upload(ctx context.Context, req *pb.UploadRequest) (*pb.UploadResponse, error) {
	app, err := interceptor.AppFromContext(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to get user from execution context")
	}

	reader := bytes.NewReader(req.Data)

	err = s.fileUC.Upload(ctx, &dto.File{
		Data:        reader,
		Name:        req.Filename,
		ContentType: req.ContentType,
	}, app.Bucket)
	if err != nil {
		return nil, s.parseUseCaseErr(err)
	}

	return &pb.UploadResponse{}, nil
}

func (s *fileServer) parseUseCaseErr(err error) error {
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
