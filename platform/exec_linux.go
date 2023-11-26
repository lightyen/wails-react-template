//go:build linux

package platform

import "bytes"

func ShellExec(command string) (*bytes.Buffer, error) {
	return Exec("/bin/sh", "-c", command)
}

func ShellBack(command string) error {
	return ExecBack("/bin/sh", "-c", command)
}
