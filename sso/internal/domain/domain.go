package domain

import "github.com/pillowskiy/postique/sso/internal/lib/gen"

const EmptyID = ID("")

type (
	// Potential ID - necessary to point to the child ID type, since we can change the policy
	// and switch from UUID to Snowflake ID, for example, this will save us the problem
	// of switching and changing the entire delivery layer
	PID = string
	ID  PID
)

func GenID() (ID, error) {
	id, err := gen.GenerateUUID()
	return ID(id), err
}

func NewID(str string) (ID, error) {
	id, err := gen.ParseUUID(str)
	return ID(id), err
}
