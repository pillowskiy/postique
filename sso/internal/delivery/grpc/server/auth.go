package server

import (
	"context"
	"log"

	ssov1 "github.com/pillowskiy/postique/sso/gen/sso"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type authServer struct {
	ssov1.UnimplementedAuthServer
}

func RegisterAuthServer(server *grpc.Server) {
	ssov1.RegisterAuthServer(server, &authServer{})
}

func (s *authServer) Login(ctx context.Context, req *ssov1.LoginRequest) (*ssov1.LoginResponse, error) {
	if err := req.ValidateAll(); err != nil {
		if valResult, ok := err.(ssov1.LoginRequestMultiError); ok {
			for _, err := range valResult.AllErrors() {
				valErr, ok := err.(ssov1.LoginRequestValidationError)
				if !ok {
					continue
				}

				log.Printf("Validation error: %+v", valErr.Reason())
			}
		}
		return nil, status.Errorf(codes.InvalidArgument, "invalid request: %v", err)
	}
	panic("umimplemented")
}

func (s *authServer) Register(ctx context.Context, req *ssov1.RegisterRequest) (*ssov1.RegisterResponse, error) {
	panic("umimplemented")
}

func (s *authServer) IsAdmin(ctx context.Context, req *ssov1.IsAdminRequest) (*ssov1.IsAdminResponse, error) {
	panic("umimplemented")
}
