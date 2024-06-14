package config

import (
	"os"
	"path/filepath"

	"{{.ProjectName}}/platform"
)

var (
	ConfigPath = filepath.Join(platform.UserDataPath(), "config.json")
	Config     Configuration
)

type Configuration struct {
	LogLevel string `json:"log_level" yaml:"log_level" default:"INFO" usage:"Log level words: trace, debug, info, warn, error, panic, fatal, disabled"`
}

func init() {
	if v, exists := os.LookupEnv("CONFIG"); exists {
		if v != "" {
			ConfigPath = v
		}
	}
}
