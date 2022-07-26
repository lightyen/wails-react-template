package platform

import (
	_ "embed"
	"os"
	"path/filepath"
	"runtime"
)

func IsWindows() bool {
	return runtime.GOOS == "windows"
}

func UserDataPath() string {
	s, err := os.UserConfigDir()
	if err != nil {
		panic(err)
	}
	return filepath.Join(s, ProjectName)
}
