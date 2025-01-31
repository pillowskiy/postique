package logger

import (
	"io"
	"log/slog"
)

type HandlerType string

const (
	HandlerTypeText   HandlerType = "text"
	HandlerTypeJSON   HandlerType = "json"
	HandlerTypePretty HandlerType = "pretty"
)

func ParseLevel(l string) slog.Leveler {
	switch l {
	case "info":
		return slog.LevelInfo
	case "debug":
		return slog.LevelDebug
	case "warn":
		return slog.LevelWarn
	case "error":
		return slog.LevelError
	default:
		return slog.LevelInfo
	}
}

func ParseHandlerType(ht string) HandlerType {
	switch ht {
	case "text":
		return HandlerTypeText
	case "json":
		return HandlerTypeJSON
	case "pretty":
		return HandlerTypePretty
	default:
		return HandlerTypeJSON
	}
}

type Options struct {
	AddSource   bool
	Level       slog.Leveler
	HandlerType HandlerType
}

func NewSlog(w io.Writer, opts *Options) *slog.Logger {
	var handler slog.Handler
	hOpts := &slog.HandlerOptions{
		AddSource: opts.AddSource,
		Level:     opts.Level,
	}

	switch opts.HandlerType {
	case HandlerTypeText:
		handler = slog.NewTextHandler(w, hOpts)
	case HandlerTypeJSON:
		handler = slog.NewJSONHandler(w, hOpts)
	case HandlerTypePretty:
		handler = NewPrettyHandler(hOpts)
	default:
		handler = slog.NewJSONHandler(w, hOpts)
	}

	logger := slog.New(handler)
	return logger
}
