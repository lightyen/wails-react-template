package errors

import (
	"fmt"
	"runtime"
	"strings"
)

type StackTraceDescriptor interface {
	Stack() string
}

type StackTrace runtime.Frames

func Stack(skip int, maxDepth int) StackTrace {
	pcs := make([]uintptr, maxDepth)
	n := runtime.Callers(skip, pcs[:])
	return StackTrace(*runtime.CallersFrames(pcs[:n]))
}

func (s StackTrace) String() string {
	sb := &strings.Builder{}
	stk := (runtime.Frames)(s) //clone
	for {
		f, hasMore := (&stk).Next()
		if !hasMore {
			break
		}
		if f.Func != nil {
			// Example:
			// 0x433d7e runtime.goPanicIndex
			// 	/usr/lib/go/src/runtime/panic.go:113
			_, _ = fmt.Fprintf(sb, "0x%x %s\n\t%s:%d\n", f.PC, f.Function, f.File, f.Line)
		}
	}
	return sb.String()
}
