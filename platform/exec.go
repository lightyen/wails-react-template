package platform

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"os/exec"
	"strings"
	"time"

	"app/platform/zlog"
)

type ExecOptions struct {
	Ctx          context.Context
	Env          []string
	Dir          string
	InBackground bool
	Stdin        io.Reader
	Stdout       io.Writer
	Stderr       io.Writer
	Silent       bool
	LogLevel     string // info/debug
}

func ExecWithOptions(options ExecOptions, cmdstr string, args ...string) (stdoutBuf *bytes.Buffer, err error) {
	var cmd *exec.Cmd

	if options.Ctx != nil {
		cmd = exec.CommandContext(options.Ctx, cmdstr, args...)
	} else {
		cmd = exec.Command(cmdstr, args...)
	}

	cmd.Env = options.Env
	cmd.Dir = options.Dir

	var stderrBuf *bytes.Buffer

	if !options.InBackground {
		cmd.Stdin = options.Stdin
		if options.Stdout != nil {
			cmd.Stdout = options.Stdout
		} else {
			stdoutBuf = new(bytes.Buffer)
			cmd.Stdout = stdoutBuf
		}
		if options.Stderr != nil {
			cmd.Stderr = options.Stderr
		} else {
			stderrBuf = new(bytes.Buffer)
			cmd.Stderr = stderrBuf
		}
	}

	if !options.Silent {
		t := time.Now()
		defer func() {
			if options.InBackground {
				switch options.LogLevel {
				default:
					zlog.Tracef("EXEC %s %s", cmdstr, strings.Join(args, " "))
				case "info", "INFO":
					zlog.Infof("EXEC %s %s", cmdstr, strings.Join(args, " "))
				case "debug", "DEBUG":
					zlog.Debugf("EXEC %s %s", cmdstr, strings.Join(args, " "))
				}
			} else {
				switch options.LogLevel {
				default:
					zlog.Tracef("EXEC %s %s", cmdstr, strings.Join(args, " "))
				case "info", "INFO":
					zlog.Infof("(%v) EXEC %s %s", time.Since(t), cmdstr, strings.Join(args, " "))
				case "debug", "DEBUG":
					zlog.Debugf("(%v) EXEC %s %s", time.Since(t), cmdstr, strings.Join(args, " "))
				}
			}
		}()
	}

	err = cmd.Start() // non-blocking
	if err != nil {
		return stdoutBuf, fmt.Errorf("EXEC %s %s %w", cmdstr, strings.Join(args, " "), err)
	}

	if options.InBackground {
		return stdoutBuf, nil
	}

	err = cmd.Wait()
	if err != nil || !cmd.ProcessState.Success() {
		return stdoutBuf, fmt.Errorf("EXEC %s %s %s", cmd.ProcessState, cmdstr, strings.Join(args, " "))
	}

	return stdoutBuf, nil
}

// Exec run the external command and return its response.
func Exec(cmdstr string, args ...string) (*bytes.Buffer, error) {
	return ExecWithOptions(ExecOptions{}, cmdstr, args...)
}

// ExecBack run the external command at background.
func ExecBack(cmdstr string, args ...string) error {
	_, err := ExecWithOptions(ExecOptions{InBackground: true}, cmdstr, args...)
	return err
}
