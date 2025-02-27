package config

import (
	"flag"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

type Server struct {
	Port    int    `yaml:"port" env-required:"true"`
	Timeout string `yaml:"timeout" env-default:"15s"`
}

type S3 struct {
	Endpoint             string `yaml:"endpoint" env-required:"true"`
	Region               string `yaml:"region" env-required:"true"`
	AccessKey            string `yaml:"access_key" env-required:"true"`
	SecretKey            string `yaml:"secret_key" env-required:"true"`
	ForcePathStyle       bool   `yaml:"force_path_style" env-default:"false"`
	MultipartChunkSizeMB int    `yaml:"multipart_chunk_size_mb" env-default:"5"`
	UploadBufferSizeMB   int    `yaml:"upload_buffer_size_mb" env-default:"5"`
}

type Config struct {
	DecryptKey string `yaml:"decrypt_key" env-required:"true"`
	Server     Server `yaml:"server"`
	S3         S3     `yaml:"s3"`
}

func MustLoad() *Config {
	configPath := fetchConfigPath()
	return MustLoadFromPath(configPath)
}

func MustLoadFromPath(configPath string) *Config {
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		panic("config file does not exist: " + configPath)
	}

	var cfg Config
	if err := cleanenv.ReadConfig(configPath, &cfg); err != nil {
		panic("cannot read config: " + err.Error())
	}

	return &cfg
}

func fetchConfigPath() string {
	var res string

	flag.StringVar(&res, "config", "", "path to config file")
	flag.Parse()

	if res == "" {
		res = os.Getenv("CONFIG_PATH")
	}

	return res
}
