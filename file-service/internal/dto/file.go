package dto

import "io"

type File struct {
	Data        io.ReadSeeker
	Name        string
	ContentType string
}
