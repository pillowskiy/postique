package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	RequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "app_requests_total",
			Help: "The total number of processed requests",
		},
		[]string{"method", "status"},
	)

	RequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "app_request_duration_seconds",
			Help:    "Request duration in seconds",
			Buckets: []float64{0.01, 0.05, 0.1, 0.5, 1, 2.5, 5, 10},
		},
		[]string{"method"},
	)

	AuthAttempts = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "app_auth_attempts_total",
			Help: "The total number of authentication attempts",
		},
		[]string{"status"},
	)

	ActiveSessions = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "app_active_sessions",
			Help: "The number of active sessions",
		},
	)

	DBQueryDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "app_db_query_duration_seconds",
			Help:    "Database query duration in seconds",
			Buckets: []float64{0.01, 0.05, 0.1, 0.5, 1, 2.5, 5},
		},
		[]string{"operation"},
	)

	UserRegistrations = promauto.NewCounter(
		prometheus.CounterOpts{
			Name: "app_user_registrations_total",
			Help: "The total number of user registrations",
		},
	)

	PasswordResets = promauto.NewCounter(
		prometheus.CounterOpts{
			Name: "app_password_resets_total",
			Help: "The total number of password reset operations",
		},
	)
)
