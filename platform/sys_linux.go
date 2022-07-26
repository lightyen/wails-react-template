//go:build linux

package platform

import "errors"

func OpenFileExplorer(target string) error {
	return errors.ErrUnsupported
}
