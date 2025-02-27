package s3

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	manager "github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/pillowskiy/postique/files/internal/config"
)

type Storage struct {
	*s3.S3
	Uploader *s3manager.Uploader
}

func MustConnect(cfg config.S3) *Storage {
	sess, err := session.NewSession(&aws.Config{
		Region:           aws.String(cfg.Region),
		Endpoint:         aws.String(cfg.Endpoint),
		Credentials:      credentials.NewStaticCredentials(cfg.AccessKey, cfg.SecretKey, ""),
		S3ForcePathStyle: aws.Bool(cfg.ForcePathStyle),
	})
	if err != nil {
		panic(err)
	}

	uploader := s3manager.NewUploader(sess, func(u *s3manager.Uploader) {
		u.BufferProvider = manager.NewBufferedReadSeekerWriteToPool(
			cfg.UploadBufferSizeMB * 1024 * 1024,
		)
		u.PartSize = int64(cfg.MultipartChunkSizeMB) * 1024 * 1024
	})

	return &Storage{
		S3:       s3.New(sess),
		Uploader: uploader,
	}
}
