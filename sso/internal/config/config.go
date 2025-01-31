package config

import (
	"flag"
	"os"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	Server   Server   `yaml:"server"`
	Postgres Postgres `yaml:"postgres"`
	Logger   Logger   `yaml:"logger"`
}

type Server struct {
	Port    int           `yaml:"port" env-default:"4000"`
	Timeout time.Duration `yaml:"timeout" env-default:"15s"`
}

type Postgres struct {
	Host     string `yaml:"host" env-required:"true"`
	Port     int    `yaml:"port" env-required:"true"`
	User     string `yaml:"user" env-required:"true"`
	Password string `yaml:"password" env-required:"true"`
	Database string `yaml:"database" env-required:"true"`
	SSL      string `yaml:"ssl" env-default:"false"`
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
