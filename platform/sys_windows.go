//go:build windows

package platform

import (
	"path/filepath"
)

func OpenFileExplorer(target string) error {
	target = filepath.Clean(target)
	// _, err := Exec("powershell", "-nologo", "-noprofile", "explorer "+target)
	_, _ = Exec("explorer", target)
	return nil
}
