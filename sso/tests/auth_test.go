package tests

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v7"
	pb "github.com/pillowskiy/postique/pb/v1/sso"
	"github.com/pillowskiy/postique/sso/internal/lib/jwt"
	"github.com/pillowskiy/postique/sso/tests/suites"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

const (
	defaultPasswordLen  = 10
	tooShortPasswordLen = 5
	tooLongPasswordLen  = 65

	storedAppName        = "test-app"
	storedAnotherAppName = "diff-app"
	storedUserEmail      = "user@gmail.com"
	storedUserPassword   = "123456"
)

func genPassword(len int) string {
	return gofakeit.Password(true, false, false, false, true, len)
}

func assertValidSession(st *suites.AuthSuite, approxCreatedAt time.Time, userID string, session *pb.Session) {
	assert.NotEmpty(st.T, session.GetAccessToken())
	assert.NotEmpty(st.T, session.GetRefreshToken())
	assert.NotZero(st.T, session.GetExpiresIn())
	assert.Equal(st.T, session.GetTokenType(), "Bearer")

	var payload map[string]any
	err := jwt.VerifyAndScan(session.GetAccessToken(), st.Cfg.Session.AccessTokenSecret, &payload)
	require.NoError(st.T, err)
	assert.Equal(st.T, payload["UserID"].(string), userID)
	assert.InDelta(st.T, approxCreatedAt.Add(time.Duration(session.ExpiresIn)*time.Second).Unix(), payload["exp"].(float64), 5)
}

func requireSuccessVerify(st *suites.AuthSuite, ctx context.Context, userID string, session *pb.Session) {
	authHeader := fmt.Sprintf("%s %s", session.GetTokenType(), session.GetAccessToken())
	ctx = metadata.AppendToOutgoingContext(ctx, "authorization", authHeader)
	respVerify, err := st.Client.Verify(ctx, &pb.VerifyRequest{})
	require.NoError(st.T, err)
	assert.Equal(st.T, respVerify.GetUserId(), userID)
}

func TestAuth_AuthCycle_Success(t *testing.T) {
	ctx, st := suites.NewAuth(t)

	email := gofakeit.Email()
	password := genPassword(defaultPasswordLen)

	respRegister, err := st.Client.Register(ctx, &pb.RegisterRequest{
		Email:    email,
		Password: password,
	})

	require.NoError(t, err)

	userID := respRegister.GetUserId()
	assert.NotEmpty(t, userID)

	respLogin, err := st.Client.Login(ctx, &pb.LoginRequest{
		Email:    email,
		Password: password,
		AppName:  storedAppName,
	})

	require.NoError(t, err)
	assertValidSession(st, time.Now(), userID, respLogin.Session)
	requireSuccessVerify(st, ctx, userID, respLogin.Session)

	refreshReq := &pb.RefreshRequest{
		Token:   respLogin.Session.RefreshToken,
		AppName: storedAppName,
	}
	respRefresh, err := st.Client.Refresh(ctx, refreshReq)

	require.NoError(t, err)
	assertValidSession(st, time.Now(), userID, respRefresh.Session)
	requireSuccessVerify(st, ctx, userID, respRefresh.Session)

	// The previous session refresh token should be invalid to refresh the session
	respRefreshInv, err := st.Client.Refresh(ctx, refreshReq)
	require.Error(t, err)
	require.Nil(t, respRefreshInv)
}

func TestAuth_Register_InvalidArgument(t *testing.T) {
	ctx, st := suites.NewAuth(t)

	tests := []struct {
		name     string
		email    string
		password string
	}{
		{
			name:     "Empty_Password",
			email:    gofakeit.Email(),
			password: "",
		},
		{
			name:     "Short_Password",
			email:    gofakeit.Email(),
			password: genPassword(tooShortPasswordLen),
		},
		{
			name:     "Long_Password",
			email:    gofakeit.Email(),
			password: genPassword(tooLongPasswordLen),
		},
		{
			name:     "Empty_Email",
			email:    "",
			password: genPassword(defaultPasswordLen),
		},
		{
			name:     "Invalid_Email",
			email:    "not_email",
			password: genPassword(defaultPasswordLen),
		},
		{
			name:     "All_Empty",
			email:    "",
			password: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := st.Client.Register(ctx, &pb.RegisterRequest{
				Email:    tt.email,
				Password: tt.password,
			})
			require.Error(t, err)
			grpcSt, ok := status.FromError(err)
			require.True(t, ok, "Expected error to be a grpc status")
			assert.Equal(t, grpcSt.Code(), codes.InvalidArgument)
			details := grpcSt.Details()
			assert.GreaterOrEqual(t, len(details), 1, "Expected 1 or more grpc status details")
		})
	}
}

func TestAuth_Login_InvalidArgument(t *testing.T) {
	ctx, st := suites.NewAuth(t)

	tests := []struct {
		name     string
		email    string
		password string
		appName  string
	}{
		{
			name:     "Empty_Password",
			email:    gofakeit.Email(),
			password: "",
			appName:  storedAppName,
		},
		{
			name:     "Short_Password",
			email:    gofakeit.Email(),
			password: genPassword(tooShortPasswordLen),
			appName:  storedAppName,
		},
		{
			name:     "Long_Password",
			email:    gofakeit.Email(),
			password: genPassword(tooLongPasswordLen),
			appName:  storedAppName,
		},
		{
			name:     "Empty_Email",
			email:    "",
			password: genPassword(defaultPasswordLen),
			appName:  storedAppName,
		},
		{
			name:     "Invalid_Email",
			email:    "not_email",
			password: genPassword(defaultPasswordLen),
			appName:  storedAppName,
		},
		{
			name:     "Empty_AppName",
			email:    gofakeit.Email(),
			password: genPassword(defaultPasswordLen),
			appName:  "",
		},
		{
			name:     "All_Empty",
			email:    "",
			password: "",
			appName:  "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := st.Client.Login(ctx, &pb.LoginRequest{
				Email:    tt.email,
				Password: tt.password,
				AppName:  tt.appName,
			})
			require.Error(t, err)
			grpcSt, ok := status.FromError(err)
			require.True(t, ok, "Expected error to be a grpc status")
			assert.Equal(t, grpcSt.Code(), codes.InvalidArgument)
			details := grpcSt.Details()
			assert.GreaterOrEqual(t, len(details), 1, "Expected 1 or more grpc status details")
		})
	}
}

func TestAuth_Refresh_InvalidArgument(t *testing.T) {
	ctx, st := suites.NewAuth(t)

	tests := []struct {
		name    string
		token   string
		appName string
	}{
		{
			name:    "Empty_Token",
			token:   "",
			appName: storedAppName,
		},
		{
			name:    "Empty_AppName",
			token:   "invalidtoken",
			appName: "",
		},
		{
			name:    "All_Empty",
			token:   "",
			appName: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := st.Client.Refresh(ctx, &pb.RefreshRequest{
				Token:   tt.token,
				AppName: tt.appName,
			})
			require.Error(t, err)
			grpcSt, ok := status.FromError(err)
			require.True(t, ok, "Expected error to be a grpc status")
			assert.Equal(t, grpcSt.Code(), codes.InvalidArgument)
			details := grpcSt.Details()
			assert.GreaterOrEqual(t, len(details), 1, "Expected 1 or more grpc status details")
		})
	}
}
