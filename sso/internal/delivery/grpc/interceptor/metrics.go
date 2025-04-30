package interceptor

import (
	"context"
	"log/slog"
	"time"

	"github.com/pillowskiy/postique/sso/pkg/metrics"
	"google.golang.org/grpc"
	"google.golang.org/grpc/status"
)

func UnaryWithMetrics(log *slog.Logger) grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (interface{}, error) {
		startTime := time.Now()

		resp, err := handler(ctx, req)

		duration := time.Since(startTime).Seconds()

		metrics.RequestDuration.WithLabelValues(info.FullMethod).Observe(duration)

		statusCode := "success"
		if err != nil {
			st, _ := status.FromError(err)
			statusCode = st.Code().String()
		}

		metrics.RequestsTotal.WithLabelValues(info.FullMethod, statusCode).Inc()

		log.Debug(
			"gRPC request processed",
			slog.String("method", info.FullMethod),
			slog.Float64("duration", duration),
			slog.String("status", statusCode),
		)

		return resp, err
	}
}
