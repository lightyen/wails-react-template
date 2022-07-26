package common

import (
	_ "embed"
	"os"
	"path/filepath"
	"runtime"
)

func AppName() string {
	return "{{.ProjectName}}"
}

func isTruthy(s string) bool {
	return s == "1" || s == "yes" || s == "on" || s == "true" || s == "enabled"
}

func IsDevelopment() bool {
	return isTruthy(os.Getenv("DEV_MODE"))
}

func IsWindows() bool {
	return runtime.GOOS == "windows"
}

func UserDataPath() string {
	s, err := os.UserConfigDir()
	if err != nil {
		panic(err)
	}
	return filepath.Join(s, AppName())
}
