package server

import (
	"errors"
	"fmt"

	"github.com/pillowskiy/postique/sso/pkg/validator"
	"google.golang.org/genproto/googleapis/rpc/errdetails"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// ValidationRulesMap holds the mapping between the {FieldName}.{Constraint} pair and the error message.
type ValidationRulesMap map[string]string

func formatValidationError(err error, validationMessages ValidationRulesMap) error {
	var validationErr *validator.ValidationError
	if !errors.As(err, &validationErr) {
		return status.Error(codes.Internal, fmt.Sprintf("Failed to process validation results: %v", err))
	}

	st := status.Newf(codes.InvalidArgument, "InvalidArgument")
	details := &errdetails.BadRequest{}
	for _, v := range validationErr.Violations {
		fv := &errdetails.BadRequest_FieldViolation{
			Field:       v.FieldName,
			Description: v.Format(validationMessages[fmt.Sprintf("%s.%s", v.FieldName, v.Constraint)]),
		}
		details.FieldViolations = append(details.FieldViolations, fv)
	}

	st, err = st.WithDetails(details)
	if err != nil {
		return status.Error(codes.Internal, "Unexpected error attaching metadata")
	}

	return st.Err()
}
