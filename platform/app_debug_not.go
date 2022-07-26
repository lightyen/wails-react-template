//go:build !debug

package platform

func IsDebug() bool {
	return false
}
