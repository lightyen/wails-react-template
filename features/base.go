package features

import (
	"context"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/evanoberholster/imagemeta"
	"github.com/evanoberholster/imagemeta/imagetype"
	"github.com/gin-gonic/gin"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// Feature: Preview Image
type Base struct {
	ctx              context.Context
	currentDirectory string
	currentFile      string
}

func NewBase() Feature {
	return &Base{}
}

func (b *Base) OnStartup(ctx context.Context) {
	b.ctx = ctx
	files := b.handleFirstCommandArgment()
	runtime.EventsOn(b.ctx, "webReady", func(_ ...interface{}) {
		if files != nil {
			runtime.EventsEmit(b.ctx, "images", files)
		}
	})
}

func (b *Base) OnShutdown(ctx context.Context) {
	//
}

func (b *Base) Routes(ctx context.Context, e *gin.Engine) {
	img := e.Group("/img")
	{
		img.GET("/:name", func(c *gin.Context) {
			name := c.Param("name")
			c.File(filepath.Join(b.currentDirectory, name))
		})
	}
}

func isImage(filename string) bool {
	f, err := os.Open(filename)
	if err != nil {
		return false
	}
	defer f.Close()
	e, _ := imagemeta.Decode(f)
	if err != nil {
		return false
	}
	if e.ImageType == imagetype.ImageUnknown {
		b := make([]byte, 512)
		_, _ = f.Seek(0, io.SeekStart)
		_, _ = f.Read(b)
		switch {
		case strings.HasPrefix(http.DetectContentType(b), "image/"):
			return true
		default:
			return false
		}
	}
	return true
}

func (b *Base) handleFirstCommandArgment() (files interface{}) {
	arg := ""
	if len(os.Args) > 1 {
		arg = os.Args[1]
	}
	if arg == "" {
		return
	}

	info, err := os.Stat(arg)
	if err != nil {
		return
	}

	if !info.IsDir() {
		b.currentDirectory = filepath.Dir(arg)
		b.currentFile = filepath.Base(arg)
		return b.currentFile
	}

	items, err := listImages(arg)
	if err != nil {
		return
	}
	if len(items) > 0 {
		b.currentFile = items[0]
	} else {
		b.currentFile = ""
	}
	b.currentDirectory = arg
	files = items
	return
}

func listImages(dirname string) ([]string, error) {
	list, err := os.ReadDir(dirname)
	if err != nil {
		return nil, err
	}
	var items []string
	for _, i := range list {
		if isImage(filepath.Join(dirname, i.Name())) {
			items = append(items, i.Name())
		}
		if len(items) == 3 {
			break
		}
	}
	sort.Strings(items)
	return items, nil
}

func (b *Base) OpenFile() {
	filename, err := runtime.OpenFileDialog(b.ctx, runtime.OpenDialogOptions{})
	if err != nil {
		return
	}

	if filename == "" {
		return
	}

	if !isImage(filename) {
		return
	}

	b.currentFile = filepath.Base(filename)
	b.currentDirectory = filepath.Dir(filename)
	runtime.EventsEmit(b.ctx, "images", b.currentFile)
}

func (b *Base) OpenDirectory() {
	dir, err := runtime.OpenDirectoryDialog(b.ctx, runtime.OpenDialogOptions{})
	if err != nil {
		return
	}

	if dir == "" {
		return
	}

	items, err := listImages(dir)
	if err != nil {
		return
	}

	b.currentDirectory = dir
	if len(items) > 0 {
		b.currentFile = items[0]
	} else {
		b.currentFile = ""
	}
	runtime.EventsEmit(b.ctx, "images", items)
}
