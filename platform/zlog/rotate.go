package zlog

import (
	"errors"
	"os"
	"sync"
)

type rotateFile struct {
	mu sync.Mutex
	f  *os.File

	filename string
	maxsize  int64
}

func (f *rotateFile) Write(b []byte) (int, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	n, err := f.f.Write(b)
	if err != nil {
		return n, err
	}
	sz, err := f.size()
	if err != nil {
		return n, err
	}
	if sz >= f.maxsize {
		err = f.rotate()
	}
	return n, err
}

func (f *rotateFile) open() error {
	file, err := os.OpenFile(f.filename, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0600)
	if err != nil {
		return err
	}
	f.f = file
	return nil
}

func (f *rotateFile) close() error {
	if f.f != nil {
		return f.f.Close()
	}
	return nil
}

func (f *rotateFile) size() (int64, error) {
	if f.f == nil {
		return 0, errors.New("not open")
	}
	fi, err := f.f.Stat()
	if err != nil {
		return 0, err
	}
	return fi.Size(), nil
}

func (f *rotateFile) rotate() error {
	_ = f.close()
	if err := os.Rename(f.filename, f.filename+".1"); err != nil {
		return err
	}
	var err error
	if f.f, err = os.Create(f.filename); err != nil {
		return err
	}
	return nil
}
