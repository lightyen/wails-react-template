package errors

import (
	"errors"
)

type Error struct {
	err   error
	stack StackTrace
}

func (err *Error) Unwrap() error { return err.err }

func (err *Error) Error() string { return err.err.Error() }

func (err *Error) Stack() string {
	return err.stack.String()
}

func (err *Error) String() string {
	return err.Error() + "\n" + err.Stack()
}

func WrapError(err error) *Error {
	return &Error{err: err, stack: Stack(3, 6)}
}

func IsError(err error) bool {
	if err == nil {
		return false
	}
	_, ok := err.(*Error)
	if ok {
		return true
	}
	return IsError(errors.Unwrap(err))
}

func AsError(err error) (*Error, bool) {
	var e *Error
	ok := errors.As(err, &e)
	if !ok {
		return nil, false
	}
	return e, true
}

type RecoveredError struct {
	err   any
	stack StackTrace
}

func (err *RecoveredError) Unwrap() error {
	if v, ok := err.err.(error); ok {
		return v
	}
	return nil
}

func (err *RecoveredError) Error() string {
	switch v := err.err.(type) {
	default:
		return "<unknown error>"
	case string:
		return v
	case error:
		return v.Error()
	}
}

func (err *RecoveredError) String() string {
	return err.Error() + "\n" + err.Stack()
}

func (err *RecoveredError) Stack() string { return err.stack.String() }

// Wrap the return value from recover() func
func WrapRecoveredError(e any) *RecoveredError {
	return &RecoveredError{err: e, stack: Stack(5, 8)}
}
