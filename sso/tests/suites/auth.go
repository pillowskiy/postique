package suites

import (
	"context"
	"net"
	"strconv"
	"testing"

	pb "github.com/pillowskiy/postique/pb/v1/sso"
	"github.com/pillowskiy/postique/sso/internal/config"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

const (
	grpcHost   = "localhost"
	configPath = "../config/test.yml"
)

type AuthSuite struct {
	*testing.T
	Cfg    *config.Config
	Client pb.AuthClient
}

func NewAuth(t *testing.T) (context.Context, *AuthSuite) {
	t.Helper()
	t.Parallel()

	cfg := config.MustLoadFromPath(configPath)
	ctx, cancel := context.WithTimeout(context.Background(), cfg.Server.Timeout)

	t.Cleanup(func() {
		t.Helper()
		cancel()
	})

	conn, err := grpc.NewClient(
		net.JoinHostPort(grpcHost, strconv.Itoa(cfg.Server.Port)),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		t.Fatalf("failed to connect to server: %v", err)
	}

	authClient := pb.NewAuthClient(conn)
	return ctx, &AuthSuite{
		T:      t,
		Cfg:    cfg,
		Client: authClient,
	}
}
