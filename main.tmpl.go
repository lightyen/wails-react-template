package main

import (
	"context"
	"os"
	"os/signal"
	"path/filepath"

	"{{.ProjectName}}/config"
	"{{.ProjectName}}/platform"
	"{{.ProjectName}}/platform/zlog"
)

func appContext() (context.Context, context.CancelFunc) {
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		stop := make(chan os.Signal, 1)
		signal.Notify(stop, os.Interrupt)
		<-stop
		cancel()
	}()
	return ctx, cancel
}

func main() {
	if err := config.Parse(); err != nil {
		panic(err)
	}

	ctx, cancel := appContext()
	defer cancel()

	if err := zlog.SetFileLogger(filepath.Join(platform.UserDataPath(), "log"), config.Config.LogLevel); err != nil {
		panic(err)
	}

	NewApp().Run(ctx)
}
