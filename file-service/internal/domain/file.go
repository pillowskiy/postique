package domain

import (
	"errors"
	"io"
	"strings"
)

type File struct {
	Data        io.ReadSeeker
	Name        FileName
	ContentType ContentType
}

func NewFile(data io.ReadSeeker, name string, contentType string) (*File, error) {
	fileName, err := NewFileName(name)
	if err != nil {
		return nil, err
	}

	fileContentType, err := NewContentType(contentType)
	if err != nil {
		return nil, err
	}

	return &File{Data: data, Name: fileName, ContentType: fileContentType}, nil
}

type FileName string

func NewFileName(name string) (FileName, error) {
	if name == "" {
		return "", errors.New("file name cannot be empty")
	}

	if len(name) < 3 {
		return "", errors.New("file name should be at least 3 characters")
	}

	if len(name) > 255 {
		return "", errors.New("file name should be at most 255 characters")
	}

	return FileName(name), nil
}

func (n FileName) String() string {
	return string(n)
}

type ContentType string

func NewContentType(contentType string) (ContentType, error) {
	if contentType == "" {
		return "", errors.New("content type cannot be empty")
	}

	if len(contentType) < 3 {
		return "", errors.New("content type should be at least 3 characters")
	}

	if len(contentType) > 255 {
		return "", errors.New("content type should be at most 255 characters")
	}

	if len(strings.Split(contentType, "/")) != 2 {
		return "", errors.New("content type should be in the form of 'type/subtype'")
	}

	return ContentType(contentType), nil
}

func (c ContentType) String() string {
	return string(c)
}
