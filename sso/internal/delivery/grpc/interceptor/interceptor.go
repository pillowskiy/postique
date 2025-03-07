package interceptor

import (
	"context"
	"fmt"
	"regexp"
	"strings"

	"google.golang.org/grpc"
)

type MethodPattern = regexp.Regexp

func Method(pkg, service, method string) *MethodPattern {
	return regexp.MustCompile(fmt.Sprintf(
		"^%s%s%s$",
		parsePattern("/", pkg),
		parsePattern(".", service),
		parsePattern("/", method),
	))
}

func parsePattern(prefix, str string) string {
	if str == "*" || str == "" {
		return prefix + ".*"
	}

	str = strings.TrimPrefix(str, prefix)
	return prefix + regexp.QuoteMeta(str)
}

type UnarySpecificMethod = func(methods ...*MethodPattern) grpc.UnaryServerInterceptor

func unarySpecificMethod(intercept grpc.UnaryServerInterceptor) UnarySpecificMethod {
	return func(methods ...*MethodPattern) grpc.UnaryServerInterceptor {
		return func(ctx context.Context, req any, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp any, err error) {
            if !isMethodAllowed(info.FullMethod, methods) {
                return handler(ctx, req)
            }

            return intercept(ctx, req, info, handler)
        }
		
	}
}

func isMethodAllowed(method string, methods []*MethodPattern) bool {
	for _, m := range methods {
		if m.Match([]byte(method)) {
			return true
		}
	}
	return false
}
