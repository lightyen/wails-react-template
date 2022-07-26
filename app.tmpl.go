package main

import (
	"context"
	"embed"

	"app/common"
	"app/features"

	"github.com/gin-gonic/gin"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed frontend/dist
var assets embed.FS

type App struct {
	ctx              context.Context
	windowStartState options.WindowStartState
}

func New() *App {
	return &App{
		windowStartState: options.Normal,
	}
}

func (a *App) Run() error {
	gin.SetMode(gin.ReleaseMode)
	handler := gin.New()
	fs := []features.Feature{a, features.NewBase(), features.NewCalc()}
	bindings := make([]interface{}, len(fs))
	for i, d := range fs {
		d.SetRoutes(handler)
		bindings[i] = d
	}
	return wails.Run(&options.App{
		Title:         "{{.ProjectName}}",
		Width:         1080,
		Height:        680,
		Assets:        assets,
		AssetsHandler: handler,
		OnStartup: func(ctx context.Context) {
			for _, f := range fs {
				f.OnStartup(ctx)
			}
		},
		OnDomReady: func(ctx context.Context) {
			for _, f := range fs {
				f.OnDomReady(ctx)
			}
		},
		OnShutdown: func(ctx context.Context) {
			for _, f := range fs {
				f.OnShutdown(ctx)
			}
		},
		Frameless:        true,
		WindowStartState: a.windowStartState,
		Bind:             bindings,
		Windows: &windows.Options{
			WebviewUserDataPath: common.UserDataPath(),
		},
	})
}

func (a *App) OnStartup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) OnDomReady(ctx context.Context) {
	runtime.EventsEmit(ctx, "isMaximized", a.windowStartState == options.Maximised)
}

func (a *App) OnShutdown(ctx context.Context) {
	//
}

func (a *App) SetRoutes(e *gin.Engine) {
	//
}

func (a *App) UserDataPath() string {
	return common.UserDataPath()
}
