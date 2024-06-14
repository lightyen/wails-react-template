package zlog

import (
	"time"

	"github.com/rs/zerolog"

	"{{.ProjectName}}/platform/errors"
)

type LogLevel string

const (
	TraceLevel LogLevel = "trace"
	DebugLevel LogLevel = "debug"
	InfoLevel  LogLevel = "info"
	ErrorLevel LogLevel = "error"
	WarnLevel  LogLevel = "warn"
	PanicLevel LogLevel = "panic"
	FatalLevel LogLevel = "fatal"
	Disabled   LogLevel = "disabled"
)

var (
	Logger zerolog.Logger
)

func marshalStack(err error) interface{} {
	var sterr errors.StackTraceDescriptor
	var ok bool
	for err != nil {
		sterr, ok = err.(errors.StackTraceDescriptor)
		if ok {
			break
		}

		u, ok := err.(interface {
			Unwrap() error
		})
		if !ok {
			return nil
		}

		err = u.Unwrap()
	}
	if sterr == nil {
		return nil
	}
	return sterr.Stack()
}

func SetFileLogger(filename string, level string) error {
	switch level {
	default:
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	case "trace", "TRACE":
		zerolog.SetGlobalLevel(zerolog.TraceLevel)
	case "debug", "DEBUG":
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	case "warn", "WARN":
		zerolog.SetGlobalLevel(zerolog.WarnLevel)
	case "error", "ERROR":
		zerolog.SetGlobalLevel(zerolog.ErrorLevel)
	case "panic", "PANIC":
		zerolog.SetGlobalLevel(zerolog.PanicLevel)
	case "fatal", "FATAL":
		zerolog.SetGlobalLevel(zerolog.FatalLevel)
	case "disabled":
		zerolog.SetGlobalLevel(zerolog.Disabled)
	}

	file := &rotateFile{
		filename: filename,
		maxsize:  10 << 20, // 10 MB
	}

	if err := file.open(); err != nil {
		return err
	}

	// zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.ErrorStackMarshaler = marshalStack
	writer := zerolog.ConsoleWriter{Out: file, NoColor: true, TimeFormat: time.RFC3339}

	Logger = zerolog.New(writer)

	return nil
}

type wailsLogger struct{}

var WailsLogger = &wailsLogger{}

func (w *wailsLogger) Print(message string)   { Debug(message) }
func (w *wailsLogger) Trace(message string)   { Trace(message) }
func (w *wailsLogger) Debug(message string)   { Debug(message) }
func (w *wailsLogger) Info(message string)    { Info(message) }
func (w *wailsLogger) Warning(message string) { Warn(message) }
func (w *wailsLogger) Error(message string)   { Error(message) }
func (w *wailsLogger) Fatal(message string)   { Fatal(message) }
