package metrics

import (
	"context"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/collectors"
)

func SetupDBMetrics(db *sqlx.DB) {
	prometheus.MustRegister(collectors.NewDBStatsCollector(db.DB, "main_db"))
}

func TrackDBMetrics(ctx context.Context, operation string, fn func(ctx context.Context) error) error {
	startTime := time.Now()

	err := fn(ctx)

	duration := time.Since(startTime).Seconds()
	DBQueryDuration.WithLabelValues(operation).Observe(duration)

	return err
}

func TrackDBMetricsWithResult[T any](ctx context.Context, operation string, fn func(ctx context.Context) (T, error)) (T, error) {
	startTime := time.Now()

	result, err := fn(ctx)

	duration := time.Since(startTime).Seconds()
	DBQueryDuration.WithLabelValues(operation).Observe(duration)

	return result, err
}
