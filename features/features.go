package features

import (
	"context"

	"github.com/gin-gonic/gin"
)

type Feature interface {
	Routes(context.Context, *gin.Engine)
	OnStartup(context.Context)
	OnShutdown(context.Context)
}
