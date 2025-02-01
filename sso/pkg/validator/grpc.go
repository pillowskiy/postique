package validator

import (
	"bytes"
	"errors"
	"fmt"
	"strings"
	"text/template"

	"github.com/bufbuild/protovalidate-go"
	"google.golang.org/protobuf/proto"
)

type ValidationError struct {
	Violations []*Violation
}

func (err ValidationError) Error() string {
	bldr := &strings.Builder{}
	bldr.WriteString("validation error:")
	for _, v := range err.Violations {
		bldr.WriteString("\n - ")
		if v.FieldName != "" {
			bldr.WriteString(v.FieldName)
			bldr.WriteString(": ")
		}
		_, _ = fmt.Fprintf(bldr, "%s [%s]", v.Message, v.Constraint)
	}
	return bldr.String()
}

type Violation struct {
	Constraint string
	FieldName  string
	RuleValue  any
	FieldValue any
	Message    string
}

func (v *Violation) Format(tmplStr string) string {
	tmpl, err := template.New("").Parse(tmplStr)
	if err != nil {
		return v.Message
	}

	var buf bytes.Buffer
	if err = tmpl.Execute(&buf, v); err != nil {
		return v.Message
	}

	return buf.String()
}

func ValidateGRPC(msg proto.Message) error {
	err := protovalidate.Validate(msg)
	if err == nil {
		return nil
	}

	var valErr *protovalidate.ValidationError
	if ok := errors.As(err, &valErr); ok {
		resErr := new(ValidationError)
		for _, violation := range valErr.Violations {
			resViol := &Violation{
				Constraint: violation.Proto.GetConstraintId(),
				FieldName:  violation.Proto.GetField().GetElements()[0].GetFieldName(),
				RuleValue:  violation.RuleValue.Interface(),
				FieldValue: violation.FieldValue.Interface(),
				Message:    violation.Proto.GetMessage(),
			}

			resErr.Violations = append(resErr.Violations, resViol)
		}
		return resErr
	}

	return err
}
