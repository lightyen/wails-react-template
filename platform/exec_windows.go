//go:build windows

package platform

import "bytes"

func ShellExec(command string) (*bytes.Buffer, error) {
	return Exec("powershell", "-NoLogo", "-NoProfile", "-NonInteractive", "-NoExit", command)
}

func ShellBack(command string) error {
	return ExecBack("powershell", "-NoLogo", "-NoProfile", "-NonInteractive", "-NoExit", command)
}
