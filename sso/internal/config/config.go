package config

import (
	"flag"
	"os"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	Server   Server   `yaml:"server"`
	Session  Session  `yaml:"session"`
	Postgres Postgres `yaml:"postgres"`
	Logger   Logger   `yaml:"logger"`
	RabbitMQ RabbitMQ `yaml:"rmq"`
}

type Server struct {
	Port    int           `yaml:"port" env-default:"4000"`
	Timeout time.Duration `yaml:"timeout" env-default:"15s"`
}

type Session struct {
	TokenTTL                   time.Duration `yaml:"token_ttl" env-default:"48h"`
	EncryptionSecret           string        `yaml:"encryption_secret" env-required:"true"`
	TokenED25519PrivatePEMPath string        `yaml:"token_ed25519_private_key_path" env-required:"true"`
	TokenED25519PublicPEMPath  string        `yaml:"token_ed25519_public_key_path" env-required:"true"`
}

type RabbitMQ struct {
	URL      string `yaml:"url" env-required:"true"`
	Exchange string `yaml:"exchange" env-required:"true"`
}

type Postgres struct {
	Host         string        `yaml:"host" env-required:"true"`
	Port         int           `yaml:"port" env-required:"true"`
	User         string        `yaml:"user" env-required:"true"`
	Password     string        `yaml:"password" env-required:"true"`
	Database     string        `yaml:"database" env-required:"true"`
	SSL          string        `yaml:"ssl" env-default:"false"`
	Timeout      time.Duration `yaml:"timeout" env-default:"30s"`
	MaxIdleConns int           `yaml:"max_idle_conns" env-default:"1"`
	MaxOpenConns int           `yaml:"max_open_conns" env-default:"20"`
}

type Logger struct {
	Mode              Env    `yaml:"mode" env-required:"true"`
	DisableCaller     bool   `yaml:"disable_caller" env-default:"false"`
	DisableStacktrace bool   `yaml:"disable_stacktrace" env-default:"false"`
	Encoding          string `yaml:"encoding" env-default:"json"`
	Level             string `yaml:"level" env-default:"info"`
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
