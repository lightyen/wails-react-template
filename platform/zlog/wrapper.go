package zlog

import (
	"fmt"

	"app/platform/errors"
)

func terrors(args []any) []any {
	for i := range args {
		if err, ok := args[i].(error); ok {
			if err, ok := errors.AsError(err); ok {
				args[i] = err.String()
			}
		}
	}
	return args
}

func Trace(args ...any) {
	args = terrors(args)
	Logger.Trace().Timestamp().Msg(fmt.Sprint(args...))
}

func Tracef(format string, args ...any) {
	args = terrors(args)
	Logger.Trace().Timestamp().Msg(fmt.Sprintf(format, args...))
}

func Debug(args ...any) {
	args = terrors(args)
	Logger.Debug().Timestamp().Msg(fmt.Sprint(args...))
}

func Debugf(format string, args ...any) {
	args = terrors(args)
	Logger.Debug().Timestamp().Msg(fmt.Sprintf(format, args...))
}

func Info(args ...any) {
	args = terrors(args)
	Logger.Info().Timestamp().Msg(fmt.Sprint(args...))
}

func Infof(format string, args ...any) {
	args = terrors(args)
	Logger.Info().Timestamp().Msg(fmt.Sprintf(format, args...))
}

func Warn(args ...any) {
	args = terrors(args)
	Logger.Warn().Timestamp().Msg(fmt.Sprint(args...))
}

func Warnf(format string, args ...any) {
	args = terrors(args)
	Logger.Warn().Timestamp().Msg(fmt.Sprintf(format, args...))
}

func Error(args ...any) {
	args = terrors(args)
	Logger.Error().Timestamp().Msg(fmt.Sprint(args...))
}

func Errorf(format string, args ...any) {
	args = terrors(args)
	Logger.Error().Timestamp().Msg(fmt.Sprintf(format, args...))
}

func Panic(args ...any) {
	args = terrors(args)
	Logger.Panic().Timestamp().Msg(fmt.Sprint(args...))
}

func Panicf(format string, args ...any) {
	args = terrors(args)
	Logger.Panic().Timestamp().Msg(fmt.Sprintf(format, args...))
}

func Fatal(args ...any) {
	args = terrors(args)
	Logger.Fatal().Timestamp().Msg(fmt.Sprint(args...))
}

func Fatalf(format string, args ...any) {
	args = terrors(args)
	Logger.Fatal().Timestamp().Msg(fmt.Sprintf(format, args...))
}
