//go:build windows

package platform

import (
	"path/filepath"
	"syscall"
	"unsafe"
)

var (
	modshell32        = syscall.NewLazyDLL("shell32.dll")
	procShellExecuteW = modshell32.NewProc("ShellExecuteW")
)

func OpenFileExplorer(target string) error {
	target = filepath.Clean(target)
	p1, err := syscall.UTF16PtrFromString("open")
	if err != nil {
		return err
	}
	p2, err := syscall.UTF16PtrFromString(target)
	if err != nil {
		return err
	}
	_, _, err = syscall.SyscallN(procShellExecuteW.Addr(), 0, uintptr(unsafe.Pointer(p1)), uintptr(unsafe.Pointer(p2)), 0, 0, syscall.SW_RESTORE)
	if err != nil && err.Error() != "The operation completed successfully." {
		return err
	}
	return nil
}
