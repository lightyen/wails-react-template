package main

import (
	"context"
	"embed"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"github.com/wailsapp/wails/v2/pkg/runtime"

	"app/features"
	"app/platform"
	"app/platform/errors"
	"app/platform/zlog"
)

//go:embed frontend/dist
var assets embed.FS

const DefaultWindowStartState = options.Normal

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

type Recovery func(w http.ResponseWriter, r *http.Request)

func (h Recovery) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if e := recover(); e != nil {
			log.Print(errors.WrapRecoveredError(e).String())
		}
	}()
	h(w, r)
}

func (a *App) Run(ctx context.Context) error {
	gin.SetMode(gin.ReleaseMode)
	handler := gin.New()

	fs := []features.Feature{a, features.NewBase(), features.NewCalc()}
	bindings := make([]interface{}, len(fs))
	for i, d := range fs {
		d.Routes(ctx, handler)
		bindings[i] = d
	}

	return wails.Run(&options.App{
		Title:            "{{.ProjectName}}",
		Width:            1280,
		Height:           800,
		Frameless:        true,
		WindowStartState: DefaultWindowStartState,
		Bind:             bindings,
		Logger:           zlog.WailsLogger,
		AssetServer: &assetserver.Options{
			Assets:  assets,
			Handler: handler,
			Middleware: func(h http.Handler) http.Handler {
				return Recovery(h.ServeHTTP)
			},
		},
		OnStartup: func(ctx context.Context) {
			for _, f := range fs {
				f.OnStartup(ctx)
			}
		},
		OnShutdown: func(ctx context.Context) {
			for _, f := range fs {
				f.OnShutdown(ctx)
			}
		},
		Windows: &windows.Options{
			WebviewUserDataPath: platform.UserDataPath(),
		},
	})
}

func (a *App) OnStartup(ctx context.Context) {
	runtime.EventsOn(ctx, "openExplorer", func(args ...interface{}) {
		if len(args) > 0 {
			if target, ok := args[0].(string); ok {
				if err := platform.OpenFileExplorer(target); err != nil {
					zlog.Error("openExplorer: ", err)
				}
			}
		}
	})
	runtime.EventsOnce(ctx, "webReady", func(_ ...interface{}) {
		runtime.EventsEmit(ctx, "isMaximized", DefaultWindowStartState == options.Maximised)
	})
}

func (a *App) OnShutdown(ctx context.Context) {
	//
}

func (a *App) Routes(ctx context.Context, e *gin.Engine) {
	//
}

func (a *App) UserDataPath() string {
	return platform.UserDataPath()
}
